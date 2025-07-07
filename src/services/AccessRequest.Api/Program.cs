using System.Data;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddHttpClient("AuditApi", client =>
{
    var auditApiUrl = builder.Environment.IsDevelopment() 
        ? "http://localhost:5002/"
        : "http://audit-api:5002/";
    
    client.BaseAddress = new Uri(auditApiUrl);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")  
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

Console.WriteLine($"Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"IsDevelopment: {builder.Environment.IsDevelopment()}");

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowAngularApp");

app.MapControllers();

app.Run();
