using FabrikaBackend.Data;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// 1. VERİTABANI BAĞLANTISI (SQLite)
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

// 4. CORS AYARI (Frontend için kapıyı açar)
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


// --- 🛠️ REVİZE BÖLGESİ: VERİTABANINI HER ŞEYDEN ÖNCE GARANTİYE AL ---
// Bu blok, uygulama nefes almadan tabloları fiziksel olarak oluşturur.
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        // Bu komut tabloların (Orders vb.) kesin olarak var olmasını sağlar.
        context.Database.EnsureCreated(); 
        Console.WriteLine("--> [BAŞARILI] Veritabanı ve Tablolar ayağa kaldırıldı.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "--> [HATA] Veritabanı oluşturulurken bir sorun çıktı!");
    }
}

// 7. SWAGGER AYARI (Railway'de gözükmesi için her zaman aktif)
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Fabrika API V1");
    c.RoutePrefix = string.Empty; // Ana sayfada direkt Swagger açılır.
});

// 8. MIDDLEWARE SIRALAMASI
app.UseCors("HerkesGelsin"); 
app.UseAuthorization();
app.MapControllers();

app.Run(); // Fabrika yayına giriyor!