namespace UserManagement.Api.Models
{
    public class UserRole
    {
        public int Id { get; set; }
        public Guid UserId { get; set; }
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public DateTime AssignedDate { get; set; }
        public Guid? AssignedBy { get; set; }
        public bool IsActive { get; set; }
    }
}
