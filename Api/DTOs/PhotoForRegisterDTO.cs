using System;

namespace Api.DTOs
{
    public class PhotoForRegisterDTO
    {
        public PhotoForRegisterDTO()
        {
            this.DateAdded = DateTime.Now; // Auto Add The Date
        }

        public string Url { get; set; } // After The Cloudinary Upload
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; } // Needs To Map The Model
    }
}