using FabrikaBackend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));


builder.Services.AddControllers()
    .AddJsonOptions(options => 
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter()));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// CORS İZİN BELGESİ (Dışarıdan gelen isteklere kapıyı açar)
builder.Services.AddCors(options =>
{
    options.AddPolicy("HerkesGelsin", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("HerkesGelsin"); // Güvenliğe bu izni uygula diyoruz
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();