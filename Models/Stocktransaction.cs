using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations; // Key için ekledik

namespace FabrikaBackend.Models;

public class StockTransaction
{
    [Key]
    public int Id { get; set; }

    //ProductId artık metin (string) olduğu için uyumlu hale getirdik!
    public string ProductId { get; set; } = string.Empty;

    public int Quantity { get; set; }      // Adet
    public TransactionType Type { get; set; } // Giriş/Çıkış Tipi

    public DateTime Date { get; set; } = DateTime.Now;
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum TransactionType
{
    Giris,
    Cikis
}