using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization; // JSON çevirmenleri için alet çantamızı ekledik!

namespace FabrikaBackend.Models;

public class Order
{
    [Key]
    [JsonPropertyName("no")]
    public string No { get; set; } = string.Empty; // Örn: SIP-2026-001

    [JsonPropertyName("musteriId")]
    public string MusteriId { get; set; } = string.Empty;

    [JsonPropertyName("urunId")]
    public string UrunId { get; set; } = string.Empty;

    [JsonPropertyName("miktar")]
    public double Miktar { get; set; }

    [JsonPropertyName("birimFiyat")]
    public decimal BirimFiyat { get; set; }

    [JsonPropertyName("tarih")]
    public string Tarih { get; set; } = string.Empty; 

    [JsonPropertyName("durum")]
    public string Durum { get; set; } = string.Empty; // Beklemede, Onaylandı vs.
}