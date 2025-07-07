# DoD Access Management System

A microservices-based web application for managing user access requests and audit trails for secure Department of Defense systems.

## Architecture Overview

- **Frontend**: Angular 18 (Port 4200)
- **Backend APIs**: 
  - AccessRequest.Api (Port 5001)
  - UserManagement.Api (Port 5003)
  - Audit.Api (Port 5002)
- **Database**: SQL Server 2022 (Port 1433)
- **Containerization**: Docker & Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

### Optional (for local development)
- [Node.js 18+](https://nodejs.org/)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)

## Quick Start

### 1. Clone and Start
```bash
git clone https://github.com/jeftekhari/AntechAssessment.git
cd "AntechAssessment"

# Build and start all services
docker-compose up --build
```

### 2. Access the Application
- **Application**: http://localhost:4200
- **API Documentation**: 
  - AccessRequest API: http://localhost:5001/swagger
  - UserManagement API: http://localhost:5003/swagger
  - Audit API: http://localhost:5002/swagger

## Local Development

### Run APIs Locally
```bash
# Start each API in separate terminals
cd src/services/AccessRequest.Api && dotnet run
cd src/services/UserManagement.Api && dotnet run  
cd src/services/Audit.Api && dotnet run
```

### Run Frontend Locally
```bash
cd src/frontend/access-management-ui
npm install
ng serve
# Access at http://localhost:4200
```

## Container Management

```bash
# Start services
docker-compose up

# Rebuild after code changes
docker-compose up --build

# Stop services
docker-compose down

## Default Users

The system includes three pre-configured users for testing:

- **John Doe** (User): Can submit access requests
- **Jane Admin** (Admin): Can approve basic requests  
- **System Administrator** (SystemAdmin): Can approve all requests + view audit logs

## Features

- **Role-based access control** with hierarchical approval workflow
- **System access requests** with approval/rejection
- **Audit logging** for all system actions (System Admin only)
- **Real-time updates** using Angular reactive components
- **Dockerized deployment** with full database initialization

