// Models/Stock.cs
namespace FabrikaBackend.Models
{
    public class Stock
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; } = 0; // ŞU ANKİ MİKTAR (Örn: 500)
        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
    }
}