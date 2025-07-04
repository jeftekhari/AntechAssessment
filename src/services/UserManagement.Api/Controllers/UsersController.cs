using Microsoft.AspNetCore.Mvc;
using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using UserManagement.Api.Models;

namespace UserManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public UsersController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection GetConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    SELECT id, cac_id as CacId, first_name as FirstName, 
                           last_name as LastName, email, created_date as CreatedDate, 
                           is_active as IsActive 
                    FROM users 
                    WHERE is_active = 1";
                
                var users = await connection.QueryAsync<User>(sql);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    SELECT id, cac_id as CacId, first_name as FirstName, 
                           last_name as LastName, email, created_date as CreatedDate, 
                           is_active as IsActive 
                    FROM users 
                    WHERE id = @Id";
                
                var user = await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
                
                if (user == null)
                    return NotFound();
                
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(CreateUserRequest request)
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    INSERT INTO users (cac_id, first_name, last_name, email, created_date, is_active)
                    OUTPUT INSERTED.id, INSERTED.cac_id as CacId, INSERTED.first_name as FirstName,
                           INSERTED.last_name as LastName, INSERTED.email, INSERTED.created_date as CreatedDate,
                           INSERTED.is_active as IsActive
                    VALUES (@CacId, @FirstName, @LastName, @Email, GETDATE(), 1)";
                
                var user = await connection.QueryFirstAsync<User>(sql, request);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }


        [HttpGet("{userId}/roles")]
        public async Task<ActionResult<IEnumerable<UserRole>>> GetUserRoles(Guid userId)
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    SELECT r.id as RoleId, r.role_name as RoleName, r.description,
                        ur.assigned_date as AssignedDate
                    FROM user_roles ur
                    INNER JOIN roles r ON ur.role_id = r.id
                    WHERE ur.user_id = @UserId AND ur.is_active = 1";
                
                var userRoles = await connection.QueryAsync<UserRoleAssignment>(sql, new { UserId = userId });
                return Ok(userRoles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpPost("{userId}/roles")]
        public async Task<ActionResult<UserRole>> AssignRoleToUser(Guid userId, AssignRoleRequest request)
        {
            try
            {
                // Validate that the userId in URL matches request
                if (userId != request.UserId)
                    return BadRequest("User ID in URL must match request body");

                using var connection = GetConnection();
                var sql = @"
                    INSERT INTO user_roles (user_id, role_id, assigned_date, is_active)
                    OUTPUT INSERTED.id, INSERTED.user_id as UserId, INSERTED.role_id as RoleId,
                           INSERTED.assigned_date as AssignedDate, INSERTED.assigned_by as AssignedBy,
                           INSERTED.is_active as IsActive
                    VALUES (@UserId, @RoleId, GETDATE(), 1)";
                
                var userRole = await connection.QueryFirstAsync<UserRole>(sql, request);
                
                // Get the role name for the response
                var roleNameSql = "SELECT role_name FROM roles WHERE id = @RoleId";
                userRole.RoleName = await connection.QueryFirstAsync<string>(roleNameSql, new { RoleId = request.RoleId });
                
                return Ok(userRole);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }
    }
}
