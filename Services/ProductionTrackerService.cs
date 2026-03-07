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
        // 🚀 REVİZE 1: Program.cs'nin EnsureCreated işlemini (tablo oluşturma) 
        // tamamlaması için sisteme 10 saniyelik hayati bir avans veriyoruz.
        _logger.LogInformation("--> [OTONOM SİSTEM] Motorlar ısınıyor, 10 saniye bekleniyor...");
        await Task.Delay(10000, stoppingToken); 

        while (!stoppingToken.IsCancellationRequested)
        {
            try 
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    // 🚀 REVİZE 2: Veritabanı dosyası henüz diske yansımadıysa 
                    // tablo sorgusuna girmeden güvenli bir şekilde döngüyü bekletir.
                    if (!await context.Database.CanConnectAsync(stoppingToken))
                    {
                        _logger.LogWarning("--> [UYARI] Veritabanı bağlantısı henüz kurulamadı, bekleniyor...");
                    }
                    else
                    {
                        _logger.LogInformation("--> [KONTROL] Üretim hattı taranıyor...");

                        // Hatanın (no such table) patladığı satır artık try-catch korumasında.
                        // Tablo o an hazır değilse catch bloğuna düşer ama server KAPANMAZ.
                        var activeOrders = await context.Orders
                            .Where(o => o.Status == "Producing")
                            .ToListAsync(stoppingToken);

                        foreach (var order in activeOrders)
                        {
                            // Otonom tamamlama mantığı (5 saniye kuralı)
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
                // 🚀 REVİZE 3: Hata detayı loglanır ancak 'Unhandled Exception' oluşmaz.
                // Bir sonraki 30 saniyelik döngüde sistem her şeyi otomatik düzeltecektir.
                _logger.LogWarning("--> [SİSTEM KORUMASI] Tablo henüz hazır değil veya meşgul. Hata: {msg}", ex.Message);
            }

            // 30 saniyede bir otonom kontrol döngüsü
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);
        }
    }
}