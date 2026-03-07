using FabrikaBackend.Data;
using Microsoft.EntityFrameworkCore;

namespace FabrikaBackend.Services;

public class ProductionTrackerService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ProductionTrackerService> _logger;

    public ProductionTrackerService(IServiceProvider serviceProvider, ILogger<ProductionTrackerService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // 🚀 ÇÖZÜM 1: Program.cs'nin tabloyu oluşturması için 5 saniye bekle
        _logger.LogInformation("Fabrika motorları ısınıyor, 5 saniye bekleniyor...");
        await Task.Delay(5000, stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try 
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    _logger.LogInformation("Üretim hattı kontrol ediliyor...");

                    // 🚀 ÇÖZÜM 2: Burada Orders tablosu yoksa catch bloğuna düşer ve uygulama ÇÖKMEZ
                    var activeOrders = await context.Orders
                        .Where(o => o.Status == "Producing")
                        .ToListAsync(stoppingToken);

                    foreach (var order in activeOrders)
                    {
                        if (DateTime.UtcNow >= order.CreatedAt.AddSeconds(5)) 
                        {
                            _logger.LogInformation("Sipariş {id} tamamlandı!", order.Id);
                            order.Status = "Completed"; 
                        }
                    }
                    await context.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                // Uygulamanın kapanmasını engelleyen zırh
                _logger.LogWarning("Veritabanı henüz hazır değil veya tablo eksik. 30 sn sonra tekrar denenecek.");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}