using Microsoft.AspNetCore.Mvc;
using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using UserManagement.Api.Models;

namespace UserManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public RolesController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection GetConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    SELECT r.id, r.role_name as RoleName, r.Description
                    FROM roles r
                ";
                var roles = await connection.QueryAsync<Role>(sql);
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"An error occurred while fetching roles: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(int id)
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    SELECT r.id, r.role_name as RoleName, r.description
                    FROM roles r 
                    WHERE r.id = @Id";
                
                var role = await connection.QueryFirstOrDefaultAsync<Role>(sql, new { Id = id });
                
                if (role == null)
                    return NotFound();
                
                return Ok(role);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }


        // realized for this we do not need to create a new role. the system is designed around the 3 roles.
        
        // [HttpPost]
        // public async Task<ActionResult<Role>> CreateRole(CreateRoleRequest request)
        // {
        //     try
        //     {
        //         using var connection = GetConnection();
        //         var sql = @"
        //             INSERT INTO roles (role_name, description)
        //             OUTPUT INSERTED.id, INSERTED.role_name as RoleName, 
        //                    INSERTED.description
        //             VALUES (@RoleName, @Description)";
                
        //         var role = await connection.QueryFirstAsync<Role>(sql, request);
        //         return CreatedAtAction(nameof(GetRole), new { id = role.Id }, role);
        //     }
        //     catch (Exception ex)
        //     {
        //         return StatusCode(500, $"Database error: {ex.Message}");
        //     }
        // }
    }
}
