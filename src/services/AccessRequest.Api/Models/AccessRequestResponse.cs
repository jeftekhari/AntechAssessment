namespace AccessRequest.Api.Models
{
    public class AccessRequestResponse
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string SystemName { get; set; } = string.Empty;
        public string Justification { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public string? ReviewedByName { get; set; }
        public DateTime? ReviewedDate { get; set; }
    }
}
