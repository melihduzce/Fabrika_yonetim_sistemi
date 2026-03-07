using FabrikaBackend.Data;
using Microsoft.EntityFrameworkCore;
using FabrikaBackend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers()
    .AddJsonOptions(options => 
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));
        
// PYTHON AI MOTORU İLE HABERLEŞMEK İÇİN TELEFON HATTI EKLENDİ
builder.Services.AddHttpClient();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS İZİN BELGESİ (Dışarıdan gelen isteklere kapıyı açar)
builder.Services.AddCors(options =>
{
    options.AddPolicy("HerkesGelsin", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});
builder.Services.AddHttpClient(); // Python ile konuşmamızı sağlayan hayati hat
builder.Services.AddHostedService<ProductionTrackerService>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Güvenliğe bu izni uygula diyoruz (Şalter kalktı!)
app.UseCors("HerkesGelsin"); 

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Veritabanını otomatik oluşturma/güncelleme bloğu
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>(); // Senin DbContext adın neyse o
        context.Database.EnsureCreated(); // Eğer tablolar yoksa oluşturur
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Veritabanı tabloları oluşturulurken hata oluştu.");
    }
}

app.Run();