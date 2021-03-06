using System;

namespace Api.Models
{
    public class Photos
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string PublicId { get; set; } // Needs To Map The DTO
        public DateTime DateAdded { get; set; }
        public bool IsMain { get; set; }
        public Users User { get; set; }
        public int UserId { get; set; }
    }
}
