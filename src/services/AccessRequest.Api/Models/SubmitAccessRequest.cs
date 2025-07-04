namespace AccessRequest.Api.Models
{
    public class SubmitAccessRequest
    {
        public Guid UserId { get; set; }
        public int SystemId { get; set; }
        public string Justification { get; set; } = string.Empty;
    }
}
