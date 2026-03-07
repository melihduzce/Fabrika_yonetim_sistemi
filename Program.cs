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

// 3. TELEFON HATTI VE SWAGGER (AI HABERLEŞMESİ)
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. CORS (FRONTEND ARKADAŞIN İÇİN KAPIYI AÇAR)
builder.Services.AddCors(options =>
{
    options.AddPolicy("HerkesGelsin", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// 5. OTONOM TAKİP SERVİSİ (HAYATİ ÖNEMDE)
builder.Services.AddHostedService<ProductionTrackerService>();

var app = builder.Build();

// 6. KRİTİK: VERİTABANINI HER ŞEYDEN ÖNCE ZORLA OLUŞTUR
// Bu blok servisler tam uyanmadan veritabanını hazır eder.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        context.Database.EnsureCreated(); // Tabloları (Orders vb.) hemen inşa eder.
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabanı oluşturulurken hata: ");
    }
}

// 7. SWAGGER AYARI (Railway'de gözükmesi için 'IsDevelopment' şartını kaldırdık)
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fabrika API V1");
    c.RoutePrefix = string.Empty; // URL'nin sonuna /swagger yazmadan direkt ana sayfada açılsın
});

app.UseCors("HerkesGelsin"); 
app.UseAuthorization();
app.MapControllers();

app.Run();