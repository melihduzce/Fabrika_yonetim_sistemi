using System.Text.Json.Serialization;

namespace FabrikaBackend.Models;

public class Personnel
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;

    // Artık burası düz yazı değil, seçmeli kutu olacak
    public PersonnelRole Role { get; set; }
}

// Seçenekleri buraya yazıyoruz
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum PersonnelRole
{
    Operator,
    Muhendis,
    Yonetici,
    Stajyer
}