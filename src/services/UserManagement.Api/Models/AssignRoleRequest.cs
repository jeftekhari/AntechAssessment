namespace UserManagement.Api.Models
{
    public class AssignRoleRequest
    {
        public Guid UserId { get; set; }
        public int RoleId { get; set; }
    }
}
