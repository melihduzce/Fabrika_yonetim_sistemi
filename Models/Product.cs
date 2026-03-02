using System.Text.Json.Serialization; // Çevirmen kütüphanemiz

namespace FabrikaBackend.Models;

public class Product
{
    // 1. DİKKAT: Frontend Id'yi "UR-001" şeklinde beklediği için string yaptık!
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("ad")]
    public string Name { get; set; } = string.Empty;

    // Front-end'in istediği yeni özellikler:
    [JsonPropertyName("birim")]
    public string Unit { get; set; } = string.Empty; // Adet, kg, Lt

    [JsonPropertyName("birimFiyat")]
    public decimal Price { get; set; } // Senin orijinal Price'ı buraya bağladık

    [JsonPropertyName("birimMaliyet")]
    public decimal UnitCost { get; set; }

    [JsonPropertyName("birimSure")]
    public double UnitTime { get; set; } // saat/birim

    [JsonPropertyName("gunlukUretim")]
    public double DailyProduction { get; set; } // birim/gün

    // Senin orijinal kodundaki Stok Miktarı! 
    // Frontend bu listede istememiş ama silmiyoruz, veritabanımızda aslanlar gibi dursun.
    [JsonPropertyName("stokMiktari")]
    public int StockQuantity { get; set; }
}