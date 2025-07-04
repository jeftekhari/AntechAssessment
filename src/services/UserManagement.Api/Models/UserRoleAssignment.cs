namespace UserManagement.Api.Models
{
    public class UserRoleAssignment
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public DateTime AssignedDate { get; set; }
    }
}
