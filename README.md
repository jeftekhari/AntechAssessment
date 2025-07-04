# DoD Access Management System

A microservices-based web application for managing user access requests and audit trails for secure Department of Defense systems.

## Architecture Overview

- **Frontend**: Angular 18 (Port 4200)
- **Backend APIs**: 
  - AccessRequest.Api (Port 5001)
  - UserManagement.Api (Port 5003)
- **Database**: SQL Server 2022 (Port 1433)
- **Containerization**: Docker & Docker Compose

## Prerequisites

### Required Software
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### Optional (for local development)
- [Node.js 18+](https://nodejs.org/) (for Angular development)
- [.NET 8 SDK](https://dotnet.microsoft.com/download) (for API development)

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Pseudocode Exercise"
```

### 2. Start the Application

#### Windows (PowerShell/Command Prompt)
```powershell
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

#### Mac/Linux (Terminal)
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 3. Access the Application

Once all containers are running:

- **Angular Frontend**: http://localhost:4200
- **AccessRequest API**: http://localhost:5001/swagger
- **UserManagement API**: http://localhost:5003/swagger
- **SQL Server**: localhost:1433 (sa/YourStrong@Passw0rd)

## Container Management

### Start Services
```bash
# Start all services
docker-compose up

# Start specific services
docker-compose up sqlserver accessrequest-api

# Rebuild and start (after code changes)
docker-compose up --build
```

### Stop Services
```bash
# Stop all services (preserves containers)
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (WARNING: deletes database data)
docker-compose down -v
```

### View Logs
```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs accessrequest-api

# Follow logs in real-time
docker-compose logs -f
```

### Check Service Status
```bash
# View running containers
docker-compose ps

# View container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

## Database Management

### Connect to SQL Server
```bash
# Connect to SQL Server container
docker exec -it access-management-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C
```

### Reset Database
```bash
# Stop services
docker-compose down

# Remove database volume (WARNING: deletes all data)
docker volume rm pseudocode-exercise_sqlserver_data

# Restart services (will recreate database)
docker-compose up --build
```

## Development Workflow

### Making Code Changes

#### Backend (.NET API Changes)
```bash
# After making changes to C# code
docker-compose up --build accessrequest-api

# Or rebuild specific service
docker-compose build accessrequest-api
docker-compose up accessrequest-api
```

#### Frontend (Angular Changes)
```bash
# After making changes to Angular code
docker-compose up --build angular-frontend

# For faster development, run Angular locally:
cd src/frontend/access-management-ui
npm install
npm start
# This runs Angular on http://localhost:4200 with hot reload
```

#### Database Schema Changes
```bash
# After updating database/init-db.sql
docker-compose down
docker volume rm pseudocode-exercise_sqlserver_data
docker-compose up --build
```

### Individual Service Development

#### Run APIs Locally (Alternative to Docker)
```bash
# UserManagement API
cd src/services/UserManagement.Api
dotnet restore
dotnet build
dotnet run

# AccessRequest API  
cd src/services/AccessRequest.Api
dotnet restore
dotnet build
dotnet run
```

#### Run Angular Locally
```bash
cd src/frontend/access-management-ui
npm install
ng serve
# Access at http://localhost:4200
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port (Windows)
netstat -ano | findstr :5001
taskkill /F /PID <PID>

# Find process using port (Mac/Linux)
lsof -i :5001
kill -9 <PID>
```

#### Database Connection Issues
```bash
# Check if SQL Server is running
docker-compose ps sqlserver

# Check SQL Server logs
docker-compose logs sqlserver

# Test database connection
docker exec -it access-management-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C -Q "SELECT 1"
```

#### Container Build Issues
```bash
# Clean Docker cache
docker system prune -a

# Remove specific images
docker rmi pseudocode-exercise_accessrequest-api
docker rmi pseudocode-exercise_usermanagement-api
docker rmi pseudocode-exercise_angular-frontend

# Rebuild from scratch
docker-compose build --no-cache
```

#### Angular Build Issues
```bash
# Clear npm cache
cd src/frontend/access-management-ui
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Or in container
docker-compose build --no-cache angular-frontend
```

### Service Health Checks

```bash
# Check API health
curl http://localhost:5001/swagger
curl http://localhost:5003/swagger

# Check database health
docker exec -it access-management-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Passw0rd' -C -Q "SELECT GETDATE()"
```

## Project Structure
├── database/
│ ├── init-db.sql # Database initialization script
│ ├── schema/ # Database schema files
│ └── seed-data/ # Database seed data files
├── src/
│ ├── services/
│ │ ├── AccessRequest.Api/ # Access request management API
│ │ ├── UserManagement.Api/ # User management API
│ │ └── Common.Models/ # Shared models library
│ └── frontend/
│ └── access-management-ui/ # Angular frontend application
├── docker-compose.yml # Docker services configuration
├── Dockerfile # .NET API container definition
└── README.md # 


## Default Users

The system includes three pre-configured users for testing:

- **John Doe** (User): `john.doe@dod.gov`
- **Jane Admin** (Admin): `jane.admin@dod.gov`  
- **System Administrator** (SystemAdmin): `sys.admin@dod.gov`

## API Documentation

Once running, visit the Swagger documentation:
- AccessRequest API: http://localhost:5001/swagger
- UserManagement API: http://localhost:5003/swagger

## Support

For issues or questions, please check the troubleshooting section above or review the container logs using `docker-compose logs`.