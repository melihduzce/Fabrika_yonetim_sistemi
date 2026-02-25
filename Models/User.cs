namespace FabrikaBackend.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty; // Gerçek hayatta şifrelenir ama şimdilik düz tutalım
    public string Role { get; set; } = "Personel"; // "Admin" veya "Personel" olacak
}