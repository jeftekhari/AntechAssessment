namespace Audit.Api.Models
{
    public class AuditEntry
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public int? SystemId { get; set; }
        public Guid? AccessRequestId { get; set; }
        public DateTime TimestampUtc { get; set; }
        public Guid? PerformedBy { get; set; } 
    }
}
