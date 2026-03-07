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
        // 🚀 REVİZE 1: Bekleme süresini ve bilgilendirmeyi netleştirdik.
        // Program.cs'deki EnsureCreated işleminin bitmesi için sisteme zaman tanıyoruz.
        _logger.LogInformation("--> [OTONOM SİSTEM] Motorlar ısınıyor, 10 saniye bekleniyor...");
        await Task.Delay(10000, stoppingToken); 

        while (!stoppingToken.IsCancellationRequested)
        {
            try 
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    // 🚀 REVİZE 2: Veritabanı bağlantısı yoksa tablo sorgusuna hiç girmeden döngüyü başa sarar.
                    if (!await context.Database.CanConnectAsync(stoppingToken))
                    {
                        _logger.LogWarning("--> [UYARI] Veritabanı bağlantısı henüz kurulamadı...");
                    }
                    else
                    {
                        _logger.LogInformation("--> [KONTROL] Üretim hattı taranıyor...");

                        // Hatanın patladığı meşhur satır artık try-catch korumasında:
                        var activeOrders = await context.Orders
                            .Where(o => o.Status == "Producing")
                            .ToListAsync(stoppingToken);

                        foreach (var order in activeOrders)
                        {
                            // 5 saniye kuralı: Otonom üretim tamamlama mantığı
                            if (DateTime.UtcNow >= order.CreatedAt.AddSeconds(5)) 
                            {
                                _logger.LogInformation("--> [TAMAMLANDI] Sipariş {id} üretildi!", order.Id);
                                order.Status = "Completed"; 
                            }
                        }
                        
                        if (activeOrders.Any())
                        {
                            await context.SaveChangesAsync(stoppingToken);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                // 🚀 REVİZE 3: Hata detayı loglanır ama uygulama (Unhandled Exception) ile ÇÖKMEZ.
                _logger.LogError("--> [KRİTİK HATA] Üretim servisinde aksama: {msg}", ex.Message);
            }

            // 30 saniyede bir otonom kontrol döngüsü
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}