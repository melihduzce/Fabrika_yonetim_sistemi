using FabrikaBackend.Data;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. VERİTABANI BAĞLANTISI (SQLite)
// appsettings.json içindeki "DefaultConnection"ı kullanır.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. JSON VE ENUM AYARLARI
// API yanıtlarında Enum değerlerinin (Status gibi) yazı olarak görünmesini sağlar.
builder.Services.AddControllers()
    .AddJsonOptions(options => 
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

// 3. TELEFON HATTI VE SWAGGER (AI VE FRONTEND İÇİN)
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. CORS AYARI (Frontend arkadaşının projeye bağlanabilmesi için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("HerkesGelsin", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// 5. OTONOM TAKİP SERVİSİ (ExecuteAsync içeren servisimiz)
builder.Services.AddHostedService<ProductionTrackerService>();

var app = builder.Build();

// 6. KRİTİK: VERİTABANINI VE TABLOLARI (Orders vb.) ZORLA OLUŞTUR
// Bu blok, uygulama tam ayağa kalkmadan veritabanını hazır eder.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        _ = context.Database.EnsureCreated(); // Tabloları fiziksel olarak oluşturur.
        Console.WriteLine("--> Veritabanı ve Tablolar başarıyla kontrol edildi.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabanı oluşturulurken bir hata oluştu!");
    }
}

// 7. SWAGGER AYARI 
// Railway Production modunda çalıştığı için kısıtlamayı kaldırdık.
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fabrika API V1");
    c.RoutePrefix = string.Empty; // URL'nin sonuna /swagger yazmadan direkt ana sayfada açılsın.
});

// 8. MIDDLEWARE SIRALAMASI
app.UseCors("HerkesGelsin"); 
app.UseAuthorization();
app.MapControllers();

app.Run(); // Fabrika yayına giriyor!