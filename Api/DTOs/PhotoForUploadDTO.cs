using System;
using Microsoft.AspNetCore.Http;

namespace Api.DTOs
{
    public class PhotoForUploadDTO
    {
        public PhotoForUploadDTO()
        {
            this.DateAdded = DateTime.Now; // Auto Add The Date
        }

        public string Url { get; set; } // After The Cloudinary Upload
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime DateAdded { get; set; }
        public string PublicId { get; set; } // Needs To Map The Model
    }

}