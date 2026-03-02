using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FabrikaBackend.Models;

public class Machine
{
    [Key] 
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("ad")]
    public string Name { get; set; } = string.Empty;

    // Detay kısmını kökten uçurduk! Sadece sistemin çalışması için Durum kaldı.
    [JsonPropertyName("durum")]
    public MachineStatus Status { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum MachineStatus
{
    Calisiyor,
    Durmus,
    Arizali
}