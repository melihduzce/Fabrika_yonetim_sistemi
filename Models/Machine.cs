using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FabrikaBackend.Models;

public class Machine
{
    [Key]
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("productId")]
    public int ProductId { get; set; }

    [JsonPropertyName("machine_name")]
    public string MachineName { get; set; } = string.Empty;

    [JsonPropertyName("is_used")]
    public bool IsUsed { get; set; }
}