using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations.Schema;

namespace FabrikaBackend.Models;

public class StockTransaction
{
    public int Id { get; set; }

    // Hangi ürün?
    public int ProductId { get; set; }

    // Hata veren kısımlar bunlardı (Şimdi ekliyoruz)
    public int Quantity { get; set; }      // Adet
    public TransactionType Type { get; set; } // Giriş/Çıkış Tipi

    public DateTime Date { get; set; } = DateTime.Now;
}

// "TransactionType bulunamadı" hatasını çözen kısım burası:
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TransactionType
{
    Giris,
    Cikis
}