using System;

namespace Api.DTOs
{
    public class MessageForCreateDTO
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public DateTime MessageSent { get; set; }
        public string Content { get; set; }

        public MessageForCreateDTO()
        {
            MessageSent = DateTime.Now;
        }
    }
}
