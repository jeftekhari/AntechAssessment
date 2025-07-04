namespace AccessRequest.Api.Models
{
    public class AccessRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public int SystemId { get; set; }
        public string Justification { get; set; } = string.Empty;
        public int StatusId { get; set; }
        public DateTime CreatedDate { get; set; }
        public Guid? ReviewedBy { get; set; }
        public DateTime? ReviewedDate { get; set; }
    }
}
