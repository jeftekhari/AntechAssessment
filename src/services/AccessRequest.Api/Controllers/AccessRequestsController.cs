using Microsoft.AspNetCore.Mvc;
using System.Data;
using Microsoft.Data.SqlClient;
using Dapper;
using AccessRequest.Api.Models;
using Common.Models;

namespace AccessRequest.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccessRequestsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AccessRequestsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        private IDbConnection GetConnection()
        {
            return new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        }

        [HttpPost]
        public async Task<ActionResult<AccessRequestResponse>> SubmitRequest(SubmitAccessRequest request)
        {
            try
            {
                using var connection = GetConnection();
                
                var insertSql = @"
                    INSERT INTO access_requests (user_id, system_id, justification, status_id, created_date)
                    OUTPUT INSERTED.id, INSERTED.user_id as UserId, INSERTED.system_id as SystemId,
                           INSERTED.justification, INSERTED.status_id as StatusId, 
                           INSERTED.created_date as CreatedDate
                    VALUES (@UserId, @SystemId, @Justification, 1, GETDATE())";
                
                var newRequest = await connection.QueryFirstAsync<AccessRequest.Api.Models.AccessRequest>(insertSql, request);
                
                // friendly response
                var responseSql = @"
                    SELECT ar.id, 
                           u.first_name + ' ' + u.last_name as UserName,
                           s.system_name as SystemName,
                           ar.justification,
                           rs.status_name as Status,
                           ar.created_date as CreatedDate,
                           ar.reviewed_date as ReviewedDate
                    FROM access_requests ar
                    JOIN users u ON ar.user_id = u.id
                    JOIN systems s ON ar.system_id = s.id  
                    JOIN request_statuses rs ON ar.status_id = rs.id
                    WHERE ar.id = @Id";
                
                var response = await connection.QueryFirstAsync<AccessRequestResponse>(responseSql, new { Id = newRequest.Id });
                
                return CreatedAtAction(nameof(GetRequest), new { id = newRequest.Id }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccessRequestResponse>> GetRequest(Guid id)
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    SELECT ar.id, 
                           u.first_name + ' ' + u.last_name as UserName,
                           s.system_name as SystemName,
                           ar.justification,
                           rs.status_name as Status,
                           ar.created_date as CreatedDate,
                           CASE 
                               WHEN ar.reviewed_by IS NOT NULL 
                               THEN ru.first_name + ' ' + ru.last_name 
                               ELSE NULL 
                           END as ReviewedByName,
                           ar.reviewed_date as ReviewedDate
                    FROM access_requests ar
                    JOIN users u ON ar.user_id = u.id
                    JOIN systems s ON ar.system_id = s.id  
                    JOIN request_statuses rs ON ar.status_id = rs.id
                    LEFT JOIN users ru ON ar.reviewed_by = ru.id
                    WHERE ar.id = @Id";
                
                var request = await connection.QueryFirstOrDefaultAsync<AccessRequestResponse>(sql, new { Id = id });
                
                if (request == null)
                    return NotFound();
                
                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccessRequestResponse>>> GetAllRequests(
            [FromQuery] string? status = null)
        {
            try
            {
                using var connection = GetConnection();
                
                var whereClause = "";
                object parameters;
                
                // Optional filtering by status
                if (!string.IsNullOrEmpty(status))
                {
                    whereClause = "WHERE rs.status_name = @Status";
                    parameters = new { Status = status };
                } else {
                    parameters = new { };
                }
                
                var sql = $@"
                    SELECT ar.id, 
                           u.first_name + ' ' + u.last_name as UserName,
                           s.system_name as SystemName,
                           ar.justification,
                           rs.status_name as Status,
                           ar.created_date as CreatedDate,
                           CASE 
                               WHEN ar.reviewed_by IS NOT NULL 
                               THEN ru.first_name + ' ' + ru.last_name 
                               ELSE NULL 
                           END as ReviewedByName,
                           ar.reviewed_date as ReviewedDate
                    FROM access_requests ar
                    JOIN users u ON ar.user_id = u.id
                    JOIN systems s ON ar.system_id = s.id  
                    JOIN request_statuses rs ON ar.status_id = rs.id
                    LEFT JOIN users ru ON ar.reviewed_by = ru.id
                    {whereClause}
                    ORDER BY ar.created_date DESC";
                
                var requests = await connection.QueryAsync<AccessRequestResponse>(sql, parameters);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpPut("{id}/review")]
        public async Task<ActionResult<AccessRequestResponse>> ReviewRequest(Guid id, ReviewDecision decision)
        {
            try
            {
                using var connection = GetConnection();
                
                // First, get the request and system details for authority checking
                var requestCheckSql = @"
                    SELECT ar.id, ar.user_id as UserId, ar.system_id as SystemId, ar.status_id as StatusId,
                           s.requires_special_approval as RequiresSpecialApproval,
                           s.system_name as SystemName
                    FROM access_requests ar
                    JOIN systems s ON ar.system_id = s.id
                    WHERE ar.id = @Id AND ar.status_id = 1"; // Only pending requests
                
                var requestInfo = await connection.QueryFirstOrDefaultAsync(requestCheckSql, new { Id = id });
                
                if (requestInfo == null)
                    return NotFound("Request not found or already reviewed");
                
                // Get the reviewer's highest role level
                var reviewerRoleSql = @"
                    SELECT MAX(r.id) as HighestRoleId
                    FROM user_roles ur
                    JOIN roles r ON ur.role_id = r.id
                    WHERE ur.user_id = @ReviewerId AND ur.is_active = 1";

                var reviewerHighestRoleId = await connection.QueryFirstOrDefaultAsync<int?>(reviewerRoleSql, new { ReviewerId = decision.ReviewerId });

                if (reviewerHighestRoleId == null || reviewerHighestRoleId < (int)RoleHierarchy.Admin)
                {
                    return Forbid("Insufficient permissions to review requests");
                }

                // Check if system requires special approval
                if (requestInfo.RequiresSpecialApproval && reviewerHighestRoleId < (int)RoleHierarchy.SystemAdministrator)
                {
                    return BadRequest($"Request for {requestInfo.SystemName} requires System Administrator approval. " +
                                     "This request is outside the limits of your authority.");
                }
                
                // Update the request status
                var updateSql = @"
                    UPDATE access_requests 
                    SET status_id = @StatusId, 
                        reviewed_by = @ReviewedBy, 
                        reviewed_date = GETDATE()
                    WHERE id = @Id";
                
                await connection.ExecuteAsync(updateSql, new { 
                    StatusId = decision.StatusId, 
                    ReviewedBy = decision.ReviewerId, 
                    Id = id 
                });
                
                // Get the updated request for response
                return await GetRequest(id);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<AccessRequestResponse>>> GetPendingRequestsByUserId(Guid userId)
        {
            try
            {
                using var connection = GetConnection();
                var sql = @"
                    SELECT 
                        ar.id,
                        ar.user_id as UserId,
                        ar.first_name + ' ' + ar.last_name as UserName,
                        ar.system_id as SystemId,
                        ar.justification as Justification,
                        ar.status_id as StatusId,
                        ar.created_date as CreatedDate,
                        ar.reviewed_by as ReviewedBy,
                        ar.reviewed_date as ReviewedDate,
                        u.first_name + ' ' + u.last_name as UserName,
                        s.system_name as SystemName,
                        s.classification_level as ClassificationLevel,
                        s.requires_special_approval as RequiresSpecialApproval
                    FROM access_requests ar
                    JOIN users u ON ar.user_id = u.id
                    JOIN systems s ON ar.system_id = s.id
                    WHERE ar.status_id = 1 AND ar.user_id = @UserId";

                var requests = await connection.QueryAsync<AccessRequestResponse>(sql, new { UserId = userId });
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }
    }
}
