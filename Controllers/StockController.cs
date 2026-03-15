using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Data;
using FabrikaBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FabrikaBackend.Controllers;

[Route("api/stock")]
[ApiController]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
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
        return await _context.Stocks.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Stock>> GetStock(string id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null) return NotFound("Stok bulunamadı.");
        return stock;
    }

    [HttpPost]
    public async Task<ActionResult<Stock>> CreateStock([FromBody] Stock stock)
    {
        if (stock == null || string.IsNullOrWhiteSpace(stock.Code))
            return BadRequest("Stok kodu (kod) gerekli.");
        if (await _context.Stocks.AnyAsync(s => s.Code == stock.Code))
            return BadRequest("Bu stok kodu zaten var.");
        _context.Stocks.Add(stock);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetStock), new { id = stock.Code }, stock);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStock(string id, [FromBody] Stock stock)
    {
        if (id != stock.Code) return BadRequest("ID (kod) uyuşmuyor.");
        var existing = await _context.Stocks.FindAsync(id);
        if (existing == null) return NotFound("Stok bulunamadı.");
        existing.Name = stock.Name;
        existing.QuantityText = stock.QuantityText;
        existing.Quantity = stock.Quantity;
        existing.Capacity = stock.Capacity;
        existing.CriticalLevel = stock.CriticalLevel;
        existing.UnitCost = stock.UnitCost;
        existing.UnitPrice = stock.UnitPrice;
        existing.Status = stock.Status ?? "yeterli";
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStock(string id)
    {
        var stock = await _context.Stocks.FindAsync(id);
        if (stock == null) return NotFound("Stok bulunamadı.");
        _context.Stocks.Remove(stock);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}