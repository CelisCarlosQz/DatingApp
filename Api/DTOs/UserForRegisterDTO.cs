using System.ComponentModel.DataAnnotations;

namespace Api.DTOs
{
    public class UserForRegisterDTO
    {
        [Required]
        public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "La clave debe tener entre 4 y 8 caracteres")]
        public string Password { get; set; }
    }
}