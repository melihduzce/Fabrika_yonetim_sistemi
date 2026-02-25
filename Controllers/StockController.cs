using Microsoft.AspNetCore.Mvc;
using FabrikaBackend.Data;
using FabrikaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FabrikaBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockController(AppDbContext context)
    {
        _context = context;
    }

    // STOK HAREKETİ EKLE (Giriş/Çıkış Yap)
    [HttpPost]
    public async Task<IActionResult> AddTransaction(StockTransaction transaction)
    {
        // 1. Önce o ürün gerçekten var mı diye bak
        var product = await _context.Products.FindAsync(transaction.ProductId);
        if (product == null) return NotFound("Böyle bir ürün bulunamadı!");

        // 2. İşlem Tipine Göre Hesapla
        if (transaction.Type == TransactionType.Giris)
        {
            // Girişse stoğu artır
            product.StockQuantity += transaction.Quantity;
        }
        else if (transaction.Type == TransactionType.Cikis)
        {
            // Çıkışsa ve elde yeterince varsa düş
            if (product.StockQuantity < transaction.Quantity)
            {
                return BadRequest($"Yetersiz Stok! Elde sadece {product.StockQuantity} adet var.");
            }
            product.StockQuantity -= transaction.Quantity;
        }

        // 3. Hareketi Kaydet ve Ürünü Güncelle
        _context.StockTransactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(new { Mesaj = "Stok Güncellendi", YeniStok = product.StockQuantity });
    }

    // BİR ÜRÜNÜN GEÇMİŞ HAREKETLERİNİ GÖR
    [HttpGet("Gecmis/{productId}")]
    public async Task<ActionResult<IEnumerable<StockTransaction>>> GetHistory(int productId)
    {
        return await _context.StockTransactions
                             .Where(x => x.ProductId == productId)
                             .OrderByDescending(x => x.Date)
                             .ToListAsync();
    }
}