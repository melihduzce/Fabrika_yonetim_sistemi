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
        while (!stoppingToken.IsCancellationRequested)
        {
            _logger.LogInformation("Fabrika üretim hattı kontrol ediliyor... {time}", DateTimeOffset.Now);

            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                // 1. Üretimi devam eden siparişleri bul
                var activeOrders = await context.Orders
                    .Where(o => o.Status == "Producing")
                    .ToListAsync();

                foreach (var order in activeOrders)
                {
                    // DOĞRU MANTIK: Siparişin oluşturulma tarihine bakıyoruz.
                    // Test için 1 dakika ekledik.
                    // Eğer gerçek süreyi kullanmak istersen: order.CreatedAt.AddDays(order.EstimatedDays)
                    if (DateTime.UtcNow >= order.CreatedAt.AddSeconds(5)) 
                    {
                        _logger.LogInformation("Sipariş {id} üretimi tamamlandı! Stok güncelleniyor...", order.Id);
                        order.Status = "Completed"; // Tetikleyici (Trigger) burada devreye girecek!
                    }
                }

                await context.SaveChangesAsync();
            }

            // 30 saniyede bir kontrol et
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}