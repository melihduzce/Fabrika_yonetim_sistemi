using System.Text.Json.Serialization;

namespace FabrikaBackend.Models;

public class Machine
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Artık burası düz yazı değil, aşağıda tanımladığımız seçenekler
    public MachineStatus Status { get; set; }
    public string? ErrorCode { get; set; }
}

// Swagger'da kelime olarak görünsün diye bu [JsonConverter] satırını ekledik
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum MachineStatus
{
    Calisiyor,
    Durmus,
    Arizali
}