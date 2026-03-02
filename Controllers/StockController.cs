using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Data;
using FabrikaBackend.Models;

namespace FabrikaBackend.Controllers;

[Route("api/Stock")] // Resimdeki gibi büyük S ile bıraktım Swagger'da düzgün çıksın
[ApiController]
public class StockController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Stock>>> GetStocks()
    {
        // Burada DbSet adının 'Stocks' veya 'Stock' olmasına dikkat et, AppDbContext'te nasılsa öyle olmalı.
        // Genelde çoğul yazılır: _context.Stocks
        return await _context.Stocks.ToListAsync(); 
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Stock>> GetStock(string id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null) return NotFound("Stok bulunamadı.");
        return stock;
    }

    // Senin Swagger'da gözüken o efsanevi Geçmiş metodu!
    [HttpGet("Gecmis/{productId}")]
    public async Task<ActionResult<IEnumerable<StockTransaction>>> GetStockHistory(string productId)
    {
        return await _context.StockTransactions
            .Where(st => st.ProductId == productId)
            .OrderByDescending(st => st.Date)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Stock>> CreateStock(Stock stock)
    {
        if (string.IsNullOrEmpty(stock.Code))
        {
            stock.Code = "STK-" + new Random().Next(1000, 9999);
        }

        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetStock), new { id = stock.Code }, stock);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStock(string id, Stock stock)
    {
        if (id != stock.Code) return BadRequest("Girdiğiniz ID ile Stok Kodu uyuşmuyor!");

        _context.Entry(stock).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Stocks.Any(e => e.Code == id)) return NotFound("Güncellenecek stok bulunamadı.");
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStock(string id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null) return NotFound("Silinecek stok bulunamadı.");

        _context.Stocks.Remove(stock);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}