using MeetingApp.Server.Data;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;  // Inject configuration to access JWT secret

    public UsersController(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;  // Assign configuration
    }

    [HttpPost("register")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Register([FromForm] RegisterRequest request)
    {
        if (request.ProfilePicture != null)
        {
            var filePath = Path.Combine("wwwroot", "uploads", request.ProfilePicture.FileName);

            if (!Directory.Exists(Path.Combine("wwwroot", "uploads")))
            {
                Directory.CreateDirectory(Path.Combine("wwwroot", "uploads"));
            }

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await request.ProfilePicture.CopyToAsync(stream);
            }
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            ProfilePictureUrl = request.ProfilePicture != null ? $"/uploads/{request.ProfilePicture.FileName}" : null
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null) return NotFound("User not found");

        bool passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!passwordValid) return Unauthorized("Invalid password");

        // Generate JWT Token
        var token = GenerateJwtToken(user);

        return Ok(new { token });  // Return the JWT token
    }

    // Method to generate JWT token
    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Email),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
