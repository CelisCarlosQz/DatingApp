using System;
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
        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public string Country { get; set; }
        public string City { get; set; }
        [Required]
        public DateTime DateofBirth { get; set; }

        /* Auto Initialize */
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }

        public UserForRegisterDTO()
        {
            this.Created = DateTime.Now;
            this.LastActive = DateTime.Now;
        }
    }
}