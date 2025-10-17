# Ozlakteksan Web - Deployment Guide

## Docker Deployment

### Local Development

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

Application will be available at: **http://localhost:7080**

### Coolify Deployment

1. **Create New Project** in Coolify
2. **Connect GitHub Repository**: `https://github.com/abrkgrbz/Ozlakteksan.git`
3. **Configuration**:
   - Build Type: `Docker Compose`
   - Docker Compose Location: `docker-compose.yml` (root directory)
   - Ports: `7080:7080` and `7081:7081`

4. **Environment Variables**:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://+:7080
   ```

5. **Deploy**: Click deploy and wait for build to complete

### Manual Docker Build

```bash
# Build image
docker build -t ozlakteksan-web .

# Run container
docker run -d \
  -p 7080:7080 \
  -p 7081:7081 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ASPNETCORE_URLS=http://+:7080 \
  --name ozlakteksan-web \
  ozlakteksan-web
```

## Port Configuration

- **HTTP**: 7080
- **HTTPS**: 7081

## Technology Stack

- .NET 9.0
- ASP.NET Core MVC
- Bootstrap 5
- jQuery

## Project Structure

```
Ozlakteksan/
├── Controllers/       # MVC Controllers
├── Models/           # Data Models
├── Views/            # Razor Views
├── wwwroot/          # Static Assets
├── deployment/       # Alternative deployment configs
├── Dockerfile        # Docker build configuration
└── docker-compose.yml # Docker Compose orchestration
```
