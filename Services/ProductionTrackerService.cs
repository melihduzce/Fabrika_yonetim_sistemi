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
        // 🛠️ KRİTİK EKLEME: 
        // Server yeni açıldığında Program.cs'deki EnsureCreated işleminin 
        // tamamlanması için servisi 5 saniye uyutuyoruz.
        _logger.LogInformation("Fabrika motorları ısınıyor, veritabanı bekleniyor...");
        await Task.Delay(5000, stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            try 
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    // 🛠️ EKSTRA KONTROL: Veritabanı veya tablo henüz hazır değilse hata verme, döngüye devam et.
                    if (!await context.Database.CanConnectAsync(stoppingToken))
                    {
                        _logger.LogWarning("Veritabanı henüz hazır değil, tekrar deneniyor...");
                        await Task.Delay(5000, stoppingToken);
                        continue;
                    }

                    _logger.LogInformation("Fabrika üretim hattı kontrol ediliyor... {time}", DateTimeOffset.Now);

                    // 1. Üretimi devam eden siparişleri bul
                    var activeOrders = await context.Orders
                        .Where(o => o.Status == "Producing")
                        .ToListAsync(stoppingToken);

                    foreach (var order in activeOrders)
                    {
                        // 5 saniye sonra otomatik tamamlama testi (Senin kurgun)
                        if (DateTime.UtcNow >= order.CreatedAt.AddSeconds(5)) 
                        {
                            _logger.LogInformation("Sipariş {id} üretimi tamamlandı! Stok güncelleniyor...", order.Id);
                            order.Status = "Completed"; 
                        }
                    }

                    await context.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                // Tablo bulunamadı hatası gelirse burada yakalayıp logluyoruz, uygulama çökmüyor.
                _logger.LogError("Üretim hattında bir aksama oldu: {message}", ex.Message);
            }

            // 30 saniyede bir kontrol et
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}