namespace Common.Models
{
    public class CreateAuditEntryRequest
    {
        public Guid UserId { get; set; }
        public string ActionType { get; set; } = string.Empty;
        public Guid? AccessRequestId { get; set; }
        public Guid? PerformedBy { get; set; }
    }
}
