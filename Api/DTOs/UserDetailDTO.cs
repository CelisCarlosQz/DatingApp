using System;
using System.Collections.Generic;
using Api.Models;

namespace Api.DTOs
{
    public class UserDetailDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Gender { get; set; }
        public int Age { get; set; } // Transform DatOfBirth
        public string KnownAs { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; }
        public ICollection<PhotosDetailsDTO> Photos { get; set; }
    }
}