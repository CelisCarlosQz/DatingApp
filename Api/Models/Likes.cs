namespace Api.Models
{
    public class Likes
    {
        public int LikerId { get; set; }
        public int LikeeId { get; set; }
        public Users Liker { get; set; }
        public Users Likee { get; set; }
    }
}