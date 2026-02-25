using Microsoft.AspNetCore.Mvc;
using FabrikaBackend.Data;
using FabrikaBackend.Models;
using FabrikaBackend.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace FabrikaBackend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // --- 1. KAYIT OL (REGISTER) ---
    [HttpPost("register")]
    public IActionResult Register(UserRegisterDto request)
    {
        var userExists = _context.Users.Any(u => u.Email == request.Email);
        if (userExists)
        {
            return BadRequest("Bu e-posta adresi sistemde zaten var!");
        }

        var newUser = new User
        {
            Email = request.Email,
            Password = request.Password, 
            Role = string.IsNullOrEmpty(request.Role) ? "Personel" : request.Role 
        };

        _context.Users.Add(newUser);
        _context.SaveChanges();

        return Ok($"Kayıt başarılı! Pozisyonunuz: {newUser.Role}. Artık giriş yapabilirsiniz.");
    }

    // --- 2. GİRİŞ YAP (LOGIN) VE YAKA KARTI VER ---
    [HttpPost("login")]
    public IActionResult Login(UserLoginDto request)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

        if (user == null)
        {
            return NotFound("Kayıtlı kullanıcı bulunamadı!");
        }

        if (user.Password != request.Password)
        {
            return BadRequest("Şifreniz hatalı!");
        }

        // --- İŞTE YENİ EKLENEN YAKA KARTI (JWT) ÜRETİM MERKEZİ ---
        var tokenHandler = new JwtSecurityTokenHandler();
        // Şifreyi Program.cs'deki ile aynı yapıyoruz
        var key = Encoding.UTF8.GetBytes("BenimCokGizliFabrikaSifrem123456789!"); 
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role) // Rolü yaka kartına basıyoruz
            }),
            Expires = DateTime.UtcNow.AddHours(2), // 2 saat geçerli
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwtString = tokenHandler.WriteToken(token);

        // HTML'in tam beklediği JSON formatında cevabı yolluyoruz
        return Ok(new { 
            Mesaj = "Başarıyla giriş yaptınız!", 
            Email = user.Email, 
            Rol = user.Role,
            Token = jwtString 
        });
    }
}