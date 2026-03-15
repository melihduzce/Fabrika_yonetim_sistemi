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

    // Sadece anlık stokları getiren en temel ve hatasız metot
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Stock>>> GetStocks()
    {
        return await _context.Stocks.ToListAsync();
    }
}