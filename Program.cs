using FabrikaBackend.Data;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. VERİTABANI BAĞLANTISI
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. JSON VE ENUM AYARLARI
builder.Services.AddControllers()
    .AddJsonOptions(options => 
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// 3. TELEFON HATTI VE SWAGGER
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. CORS (DIŞARIDAN ERİŞİM İZNİ)
builder.Services.AddCors(options =>
{
    options.AddPolicy("HerkesGelsin", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// 5. OTONOM TAKİP SERVİSİ
builder.Services.AddHostedService<ProductionTrackerService>();

var app = builder.Build();

// --- 🛠️ KRİTİK BÖLGE: VERİTABANINI GARANTİYE AL ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Tabloyu (Orders) fiziksel olarak diske mühürler.
        context.Database.EnsureCreated(); 
        Console.WriteLine("--> [BAŞARILI] Veritabanı ve Tablolar ayağa kaldırıldı.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "--> [HATA] Veritabanı oluşturulurken bir sorun çıktı!");
    }
}

// 6. SWAGGER VE MIDDLEWARE (Her ortamda Swagger açık!)
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fabrika API V1");
    c.RoutePrefix = string.Empty; // URL'ye tıklandığında direkt Swagger açılır.
});

app.UseCors("HerkesGelsin"); 
app.UseAuthorization();
app.MapControllers();

app.Run(); // Fabrika motoru çalışıyor!