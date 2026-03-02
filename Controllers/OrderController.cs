using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Data;
using FabrikaBackend.Models;

namespace FabrikaBackend.Controllers;

public class OrderCreateRequest
{
    public string MusteriId { get; set; } = string.Empty;
    public string UrunId { get; set; } = string.Empty;
    public double Miktar { get; set; }
}

[Route("api/siparisler")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrderController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _context.Orders.ToListAsync();
    }

    // YENİ: Tekil Sipariş Getirme
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(string id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound("Sipariş bulunamadı.");
        return order;
    }

    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(OrderCreateRequest request)
    {
        var urun = await _context.Products.FindAsync(request.UrunId);
        if (urun == null) return NotFound("Hata: Ürün bulunamadı!");

        var yeniSiparis = new Order
        {
            No = "SIP-" + DateTime.Now.Year + "-" + new Random().Next(1000, 9999),
            MusteriId = request.MusteriId,
            UrunId = request.UrunId,
            Miktar = request.Miktar,
            BirimFiyat = urun.Price, 
            Tarih = DateTime.Now.ToString("dd.MM.yyyy"), 
            Durum = "Beklemede" 
        };

        _context.Orders.Add(yeniSiparis);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = yeniSiparis.No }, yeniSiparis);
    }

    // YENİ: Sipariş Güncelleme (Örn: Durumu "Üretimde" veya "Sevk Edildi" yapmak için)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(string id, Order order)
    {
        if (id != order.No) return BadRequest("Girdiğiniz ID ile Sipariş No uyuşmuyor!");

        _context.Entry(order).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Orders.Any(e => e.No == id)) return NotFound("Güncellenecek sipariş bulunamadı.");
            else throw;
        }

        return NoContent();
    }

    // YENİ: Sipariş İptal Etme / Silme
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(string id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound("Silinecek sipariş bulunamadı.");

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
} 