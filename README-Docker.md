# 🐳 CMIS Docker Setup

This document explains how to use Docker with the College Management Information System (CMIS).

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0+

## 🚀 Quick Start

### Development Environment (Recommended)

For development, you can run just the database in Docker and run the backend/frontend locally:

```bash
# Start development database
make dev

# Or manually:
docker-compose -f docker-compose.dev.yml up -d
```

This starts:
- **PostgreSQL Database**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050` (admin@cmis.com / admin123)

Then run your backend and frontend locally as usual:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### Production Environment

To run the entire stack in Docker:

```bash
# Start production environment
make prod

# Or manually:
docker-compose up -d
```

This starts:
- **Frontend**: `http://localhost` (port 80)
- **Backend**: `http://localhost:4000`
- **Database**: `localhost:5432`
- **pgAdmin**: `http://localhost:5050`

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start development environment (database only) |
| `make prod` | Start production environment (full stack) |
| `make build` | Build all Docker images |
| `make up` | Start all services |
| `make down` | Stop all services |
| `make restart` | Restart all services |
| `make logs` | Show logs for all services |
| `make clean` | Remove all containers, volumes, and images |
| `make db` | Access database shell |
| `make migrate` | Run database migrations |

## 🔧 Configuration

### Environment Variables

The Docker setup uses these environment variables:

**Database:**
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `POSTGRES_PASSWORD`: Database password

**Backend:**
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRES_IN`: JWT token expiry time

### Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 80 | React application |
| Backend | 4000 | Express API server |
| Database | 5432 | PostgreSQL database |
| pgAdmin | 5050 | Database administration |

## 📊 Database Management

### Accessing pgAdmin

1. Go to `http://localhost:5050`
2. Login with:
   - **Email**: `admin@cmis.com`
   - **Password**: `admin123`
3. Add server connection:
   - **Host**: `db` (or `localhost` for dev)
   - **Port**: `5432`
   - **Database**: `cmis` (or `cmis_dev` for dev)
   - **Username**: `cmis_user`
   - **Password**: `cmis_password`

### Running Migrations

```bash
# Run migrations in production
make migrate

# Or manually:
docker-compose exec backend npx prisma migrate deploy
```

### Database Shell Access

```bash
# Access PostgreSQL shell
make db

# Or manually:
docker-compose exec db psql -U cmis_user -d cmis
```

## 🔍 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Check what's using the port
netstat -tulpn | grep :5432

# Stop conflicting services
docker-compose down
```

**Database connection issues:**
```bash
# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

**Build failures:**
```bash
# Clean and rebuild
make clean
make build
```

### Viewing Logs

```bash
# All services
make logs

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Resetting Everything

```bash
# Stop and remove everything
make clean

# Start fresh
make dev  # or make prod
```

## 🚀 Deployment

### Production Deployment

1. **Update environment variables** in `docker-compose.yml`
2. **Build and start**:
   ```bash
   make build
   make prod
   ```
3. **Run migrations**:
   ```bash
   make migrate
   ```

### Cloud Deployment

For cloud deployment (AWS/Azure), you'll need to:

1. **Update database connection** to use managed PostgreSQL
2. **Configure environment variables** for production
3. **Set up reverse proxy** (nginx/ALB) for SSL termination
4. **Configure monitoring** and logging

## 📁 File Structure

```
CMIS/
├── docker-compose.yml          # Production environment
├── docker-compose.dev.yml      # Development environment  
├── docker-compose.override.yml # Development overrides
├── Makefile                    # Management commands
├── server/
│   ├── Dockerfile              # Production backend image
│   ├── Dockerfile.dev          # Development backend image
│   └── .dockerignore
├── client/
│   ├── Dockerfile              # Production frontend image
│   ├── Dockerfile.dev          # Development frontend image
│   ├── nginx.conf              # Nginx configuration
│   └── .dockerignore
└── README-Docker.md            # This file
```

## 🎯 Next Steps

1. **Test the setup**: Run `make dev` and verify everything works
2. **Customize configuration**: Update environment variables as needed
3. **Add monitoring**: Consider adding health checks and monitoring
4. **Set up CI/CD**: Automate building and deployment
5. **Configure SSL**: Add HTTPS support for production

---

**Happy Dockerizing! 🐳**
