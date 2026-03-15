using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Data;
using FabrikaBackend.Models;
using System.Net.Http.Json; // Python'a JSON göndermek için şart!

namespace FabrikaBackend.Controllers;

/// <summary>Backend: productId + quantity veya frontend: musteri_adi + urun_adi + miktar.</summary>
public class OrderCreateRequest
{
    [System.Text.Json.Serialization.JsonPropertyName("productId")]
    public int ProductId { get; set; }
    [System.Text.Json.Serialization.JsonPropertyName("quantity")]
    public int Quantity { get; set; }
    [System.Text.Json.Serialization.JsonPropertyName("musteri_adi")]
    public string? MusteriAdi { get; set; }
    [System.Text.Json.Serialization.JsonPropertyName("urun_adi")]
    public string? UrunAdi { get; set; }
    [System.Text.Json.Serialization.JsonPropertyName("miktar")]
    public int Miktar { get; set; }
}

// YENİ: Sadece durumu güncellemek için özel model
public class OrderStatusUpdateRequest
{
    public string Status { get; set; } = string.Empty;
}

[Route("api/orders")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient; 

    public OrderController(AppDbContext context, HttpClient httpClient)
    {
        _context = context;
        _httpClient = httpClient;
    }

    static string? NormalizeOrderStatus(string? durum)
    {
        if (string.IsNullOrWhiteSpace(durum)) return null;
        var d = durum.Trim().ToLowerInvariant();
        if (d == "pending" || d == "beklemede") return "pending";
        if (d == "in_production" || d == "üretimde" || d == "uretimde") return "in_production";
        if (d == "completed" || d == "tamamlandı" || d == "tamamlandi" || d == "sevk edildi") return "completed";
        if (d == "cancelled" || d == "iptal") return "cancelled";
        return null;
    }

    // FİLTRELİ GET METODU (Örn: ?status=pending). Frontend uyumu: urun_adi/musteri_adi boşsa Product'tan doldurulur.
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders([FromQuery] string? status)
    {
        var query = _context.Orders.AsQueryable();
        if (!string.IsNullOrEmpty(status))
            query = query.Where(o => o.Status == status);
        var list = await query.ToListAsync();
        foreach (var o in list)
        {
            if (string.IsNullOrEmpty(o.UrunAdi))
            {
                var p = await _context.Products.FindAsync(o.ProductId);
                o.UrunAdi = p?.HamMadde;
            }
        }
        return list;
    }

    // TEKİL GET METODU (Frontend: urun_adi boşsa Product'tan doldurulur)
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound("Order not found.");
        if (string.IsNullOrEmpty(order.UrunAdi))
        {
            var p = await _context.Products.FindAsync(order.ProductId);
            order.UrunAdi = p?.HamMadde;
        }
        return order;
    }

    /// <summary>Frontend: { musteri_adi, urun_adi, miktar } veya backend: { productId, quantity } kabul eder.</summary>
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder([FromBody] OrderCreateRequest request)
    {
        if (request == null) return BadRequest("Geçersiz istek.");

        int productId;
        int quantity;
        string? musteriAdi = request.MusteriAdi?.Trim();
        string? urunAdi = request.UrunAdi?.Trim();

        if (request.Miktar > 0 && !string.IsNullOrEmpty(urunAdi))
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p =>
                    p.UrunKodu == urunAdi ||
                    p.HamMadde == urunAdi ||
                    (p.HamMadde != null && p.HamMadde.Contains(urunAdi)));
            if (product == null) return NotFound("Ürün bulunamadı: " + urunAdi);
            productId = product.Id;
            quantity = request.Miktar;
            urunAdi = product.HamMadde ?? urunAdi;
        }
        else if (request.ProductId > 0 && request.Quantity > 0)
        {
            productId = request.ProductId;
            quantity = request.Quantity;
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound("Product not found.");
            urunAdi = product.HamMadde;
        }
        else
            return BadRequest("productId+quantity veya urun_adi+miktar gerekli.");

        var productEntity = await _context.Products.FindAsync(productId);
        if (productEntity == null) return NotFound("Product not found.");

        double netDailyCapacity = productEntity.GunlukUretim * 0.85;
        if (netDailyCapacity <= 0) netDailyCapacity = 1;
        double estimatedDays = quantity / netDailyCapacity;
        if (productEntity.HasHeatTreatment) estimatedDays += 1;

        var newOrder = new Order
        {
            ProductId = productId,
            Quantity = quantity,
            EstimatedDays = Math.Round(estimatedDays, 2),
            TotalCost = productEntity.BaseCost * quantity,
            SalePrice = (productEntity.BaseCost * quantity) * 1.5,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
            MusteriAdi = musteriAdi,
            UrunAdi = urunAdi
        };

        _context.Orders.Add(newOrder);
        await _context.SaveChangesAsync();

        // --- 🤖 AI TETİKLEYİCİSİ (EVENT-DRIVEN) ---
        double capacityUtilization = (quantity / productEntity.MonthlyCapacity) * 100;
        bool isCriticalOrder = quantity > (productEntity.MonthlyCapacity * 0.20);

        if (capacityUtilization > 85 || isCriticalOrder)
        {
            try 
            {
                var aiRequest = new { mode = "risk_analysis" };
                var response = await _httpClient.PostAsJsonAsync("http://127.0.0.1:8000/api/ai/analyze", aiRequest);
                
                if(response.IsSuccessStatusCode)
                {
                    var aiResult = await response.Content.ReadAsStringAsync();
                    Console.WriteLine("\n🚨 [AI RİSK ANALİZİ DEVREYE GİRDİ] 🚨");
                    Console.WriteLine(aiResult);
                    Console.WriteLine("------------------------------------\n");
                }
            }
            catch (Exception)
            {
                Console.WriteLine("\n⚠️ [UYARI]: AI Tetiklendi ama Python sunucusu (FastAPI) şu an kapalı veya ulaşılamıyor.\n");
            }
        }

        return CreatedAtAction(nameof(GetOrder), new { id = newOrder.Id }, newOrder);
    }

    // YENİ: SADECE SİPARİŞ DURUMU GÜNCELLEME (PATCH)
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] OrderStatusUpdateRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound("Order not found.");

        // Frontend uyumu: Türkçe veya İngilizce durum kabul edilir
        var status = NormalizeOrderStatus(request.Status);
        var allowedStatuses = new[] { "pending", "in_production", "completed", "cancelled" };
        if (string.IsNullOrEmpty(status) || !allowedStatuses.Contains(status))
        {
            return BadRequest("Geçersiz durum. Örnek: Beklemede, Üretimde, Tamamlandı, İptal");
        }

        order.Status = status;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Status updated successfully", new_status = order.Status });
    }

    // TÜM SİPARİŞİ GÜNCELLEME (PUT)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(int id, Order order)
    {
        if (id != order.Id) return BadRequest("ID mismatch!");

        _context.Entry(order).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Orders.Any(e => e.Id == id)) return NotFound("Order to update not found.");
            else throw;
        }

        return NoContent();
    }

    // SİPARİŞ SİLME (DELETE)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound("Order to delete not found.");

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}