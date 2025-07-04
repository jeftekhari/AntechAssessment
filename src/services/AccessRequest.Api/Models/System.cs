namespace AccessRequest.Api.Models
{
    public class System
    {
        public int Id { get; set; }
        public string SystemName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ClassificationLevel { get; set; }
        public bool RequiresSpecialApproval { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
