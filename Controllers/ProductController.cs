using Microsoft.AspNetCore.Mvc;
using FabrikaBackend.Data;
using FabrikaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace FabrikaBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Product (Tüm ürünleri getir)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.ToListAsync();
    }

    // POST: api/Product (Yeni ürün ekle)
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        // CreatedAtAction standarda daha uygundur, eklenen ürünü geri döner
        return CreatedAtAction("GetProduct", new { id = product.Id }, product);
    }

    // PUT: api/Product/5 (GÜNCELLEME - EKLENEN KISIM BURASI)
    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduct(int id, Product product)
    {
        // 1. URL'deki ID ile gönderilen ürünün ID'si aynı mı kontrol et
        if (id != product.Id)
        {
            return BadRequest("URL ID'si ile ürün ID'si uyuşmuyor.");
        }

        // 2. Entity Framework'e bu ürünün değiştiğini söyle (Tüm alanları günceller)
        _context.Entry(product).State = EntityState.Modified;

        try
        {
            // 3. Kaydetmeyi dene
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            // Eğer kaydederken bir çakışma olursa (mesela ürün o arada silindiyse)
            if (!ProductExists(id))
            {
                return NotFound("Güncellenmek istenen ürün bulunamadı.");
            }
            else
            {
                throw;
            }
        }

        // 4. Başarılı ise boş cevap dön (204 No Content)
        return NoContent();
    }

    // DELETE: api/Product/5 (Ürün sil)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // YARDIMCI METOT: Ürün var mı yok mu kontrolü (Put işlemi için gereklidir)
    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }
}