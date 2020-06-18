using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Api.Data;
using Api.DTOs;
using Api.Models;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Api.Controllers
{
    // UserForLoginDTO - UserForRegisterDTO
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository authRepository, IConfiguration configuration, IMapper mapper)
        {
            _mapper = mapper;
            _configuration = configuration;
            _authRepository = authRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDTO userForRegisterDTO)
        {
            userForRegisterDTO.Username = userForRegisterDTO.Username.ToLower();
            if (await _authRepository.UserExist(userForRegisterDTO.Username))
                return BadRequest("El nombre de usuario ya existe");

            Users userToCreate = new Users()
            {
                Username = userForRegisterDTO.Username
            };

            var createdUser = await _authRepository.Register(userToCreate, userForRegisterDTO.Password);

            return StatusCode(201);

        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDTO userForLoginDTO)
        {

            var user = await _authRepository.Login(userForLoginDTO.Username.ToLower(), userForLoginDTO.Password);

            if (user == null)
                return Unauthorized();

            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes
                (_configuration.GetSection("AppSettings:Token").Value));

            var signingCreds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);

            var tokenDecriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = signingCreds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDecriptor);

            var usertoLogin = _mapper.Map<UserToLoginDTO>(user);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                usertoLogin
            });
        }
    }
}
