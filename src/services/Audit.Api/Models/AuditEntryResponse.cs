namespace Audit.Api.Models
{
    public class AuditEntryResponse
    {
        public Guid Id { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public DateTime TimestampUtc { get; set; }
        public string RequestedUser { get; set; } = string.Empty; 
        public string? AdminActionBy { get; set; }  
        public string? SystemAffected { get; set; }  
        public Guid? AccessRequestId { get; set; }
    }
}
