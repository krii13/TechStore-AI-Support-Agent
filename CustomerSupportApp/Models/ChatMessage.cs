namespace CustomerSupportApp.Models
{
    public class ChatMessage
    {
        public int Id { get; set; }
        public int UserId { get; set; } 
        public string Content { get; set; } = string.Empty;
        public bool IsBot { get; set; } 
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
