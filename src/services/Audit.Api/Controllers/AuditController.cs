using Microsoft.AspNetCore.Mvc;
using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using Audit.Api.Models;
using Common.Models;

namespace Audit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuditController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuditController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection GetConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AuditEntryResponse>>> GetAllAuditEntries([FromQuery] Guid userId)
        {
            try
            {
                using var connection = GetConnection();
                
                // check system admin
                var userRoleSql = @"
                    SELECT MAX(r.id) as HighestRoleId
                    FROM user_roles ur
                    JOIN roles r ON ur.role_id = r.id
                    WHERE ur.user_id = @UserId AND ur.is_active = 1";

                var userHighestRoleId = await connection.QueryFirstOrDefaultAsync<int?>(userRoleSql, new { UserId = userId });

                if (userHighestRoleId == null || userHighestRoleId < (int)RoleHierarchy.SystemAdministrator)
                {
                    return Forbid("Insufficient permissions to view audit entries. System Administrator access required.");
                }
                
                var sql = @"
                    SELECT 
                        ae.id,
                        ae.action_type as ActionType,
                        ae.timestamp_utc as TimestampUtc,
                        ae.access_request_id as AccessRequestId,
                        u.first_name + ' ' + u.last_name as RequestedUser,
                        CASE 
                            WHEN ae.performed_by IS NOT NULL 
                            THEN pu.first_name + ' ' + pu.last_name 
                            ELSE NULL 
                        END as AdminActionBy,
                        s.system_name as SystemAffected
                    FROM audit_entries ae
                    JOIN users u ON ae.user_id = u.id
                    LEFT JOIN users pu ON ae.performed_by = pu.id
                    LEFT JOIN systems s ON ae.system_id = s.id
                    ORDER BY ae.timestamp_utc DESC";
                
                var auditEntries = await connection.QueryAsync<AuditEntryResponse>(sql);
                return Ok(auditEntries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<AuditEntryResponse>> CreateAuditEntry(CreateAuditEntryRequest request)
        {
            try
            {
                using var connection = GetConnection();
                
                // Insert the audit entry
                var insertSql = @"
                    INSERT INTO audit_entries (user_id, action_type, system_id, access_request_id, performed_by, timestamp_utc)
                    OUTPUT INSERTED.id
                    VALUES (@UserId, @ActionType, @SystemId, @AccessRequestId, @PerformedBy, GETUTCDATE())";
                
                var newAuditEntryId = await connection.QueryFirstAsync<Guid>(insertSql, request);
                
                // Get the full audit entry with joined data for response
                var selectSql = @"
                    SELECT 
                        ae.id,
                        ae.action_type as ActionType,
                        ae.timestamp_utc as TimestampUtc,
                        ae.access_request_id as AccessRequestId,
                        u.first_name + ' ' + u.last_name as RequestedUser,
                        CASE 
                            WHEN ae.performed_by IS NOT NULL 
                            THEN pu.first_name + ' ' + pu.last_name 
                            ELSE NULL 
                        END as AdminActionBy,
                        s.system_name as SystemAffected
                    FROM audit_entries ae
                    JOIN users u ON ae.user_id = u.id
                    LEFT JOIN users pu ON ae.performed_by = pu.id
                    LEFT JOIN systems s ON ae.system_id = s.id
                    WHERE ae.id = @Id";
                
                var response = await connection.QueryFirstAsync<AuditEntryResponse>(selectSql, new { Id = newAuditEntryId });
                
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }
    }
}
