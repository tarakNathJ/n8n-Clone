# N8N Workflow Automation Project

## Overview

This project is a distributed workflow automation system built with multiple microservices that communicate via Apache Kafka. The architecture includes backend services, workflow processing, worker nodes, and scheduled jobs for handling automated tasks.

## Architecture

The system consists of the following components:

### Core Services

- **Primary Backend** - Main API service handling core business logic (Port: 3000)
- **Workflow Service** - Manages workflow definitions and execution (Port: 3004)
- **Worker** - Processes async tasks from Kafka queue
- **Processor** - Handles message processing from Kafka topics
- **Cron Job** - Executes scheduled tasks
- **Auto Worker** - Automated worker for continuous task processing

### Infrastructure

- **Apache Kafka** - Message broker for async communication (KRaft mode, Port: 9092)
- **PostgreSQL** - Primary database (externally hosted)
- **AWS S3** - Object storage for file handling

## Prerequisites

- Docker & Docker Compose installed
- PostgreSQL database (externally hosted or local)
- AWS Account with S3 bucket configured
- Minimum 4GB RAM available for Docker
- Ports 3000, 3004, and 9092 available

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Pull Docker Images

Pull all required Docker images from Docker Hub:

```bash
# Primary Backend Service
docker pull taraknathjana09/primary-backend

# Auto Worker Service
docker pull taraknathjana09/auto_worker

# Cron Job Service
docker pull taraknathjana09/cron_job

# Processor Service
docker pull taraknathjana09/processor

# Workflow Service
docker pull taraknathjana09/work_flow

# Worker Service
docker pull taraknathjana09/worker
```

Or pull all images at once:
```bash
docker pull taraknathjana09/primary-backend && \
docker pull taraknathjana09/auto_worker && \
docker pull taraknathjana09/cron_job && \
docker pull taraknathjana09/processor && \
docker pull taraknathjana09/work_flow && \
docker pull taraknathjana09/worker
```

### 3. Update Docker Compose File

Update the `docker-compose.yml` file to use the pulled images:

```yaml
services:
  primary-backend:
    image: taraknathjana09/primary-backend:latest
    # ... rest of configuration

  work_flow:
    image: taraknathjana09/work_flow:latest
    # ... rest of configuration

  worker:
    image: taraknathjana09/worker:latest
    # ... rest of configuration

  processor:
    image: taraknathjana09/processor:latest
    # ... rest of configuration

  cron_job:
    image: taraknathjana09/cron_job:latest
    # ... rest of configuration

  auto_worker:
    image: taraknathjana09/auto_worker:latest
    # ... rest of configuration
```

### 4. Configure Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require&channel_binding=require

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key-here
JWT_EXPIRES_IN=24h

# AWS Configuration
AWS_BACKET_NAME=your-s3-bucket-name
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key

# Kafka Configuration
KAFKA_CLIENT_ID=myKafkaClient
KAFKA_BROKERS_NAME=kafka:9092
KAFKA_TOPIC=workflow-events
KAFKA_GROUP_ID=workflow-consumer-group

# Application Environment
NODE_ENV=dev
APP_ENV=production

# Webhook Configuration
WEB_HOOK_URL=http://localhost:3004/api/hooks
```

### 5. Update Docker Compose Environment Variables

Edit `docker-compose.yml` and replace placeholder values with your actual configuration. For each service, update:

- `DATABASE_URL` - Your PostgreSQL connection string
- AWS credentials (S3 bucket name, region, access keys)
- Kafka topic names and client IDs
- JWT secret key

### 6. Start the Services

Launch all services using Docker Compose:

```bash
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f primary-backend
```

### 7. Verify Services are Running

```bash
# Check status of all services
docker-compose ps

# Test primary backend
curl http://localhost:3000/health

# Test workflow service
curl http://localhost:3004/health
```

## Service Endpoints

| Service | Port | Endpoint | Description |
|---------|------|----------|-------------|
| Primary Backend | 3000 | http://localhost:3000 | Main API endpoint |
| Workflow Service | 3004 | http://localhost:3004 | Workflow management API |
| Kafka Broker | 9092 | kafka:9092 | Internal Kafka broker |

## Environment Variables Reference

### Primary Backend Service
```bash
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=24h
PORT=3000
DATABASE_URL=<postgresql-connection-string>
NODE_ENV=dev
```

### Workflow Service
```bash
PORT=3004
DATABASE_URL=<postgresql-connection-string>
NODE_ENV=dev
WEB_HOOK_URL=http://localhost:3004/api/hooks
```

### Worker Service
```bash
KAFKA_BROKER=kafka:9092
APP_ENV=production
AWS_BACKET_NAME=<s3-bucket-name>
AWS_REGION=<aws-region>
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
KAFKA_CLIENT_ID=<client-id>
KAFKA_BROKERS_NAME=kafka:9092
KAFKA_TOPIC=<topic-name>
NODE_ENV=dev
DATABASE_URL=<postgresql-connection-string>
```

### Processor Service
```bash
KAFKA_BROKER=kafka:9092
APP_ENV=production
KAFKA_TOPIC=<topic-name>
KAFKA_BROKERS_NAME=<brokers-name>
KAFKA_CLIENT_ID=<client-id>
NODE_ENV=dev
DATABASE_URL=<postgresql-connection-string>
```

### Cron Job Service
```bash
KAFKA_BROKERS_NAME=<brokers-name>
KAFKA_CLIENT_ID=<client-id>
KAFKA_TOPIC=<topic-name>
NODE_ENV=dev
DATABASE_URL=<postgresql-connection-string>
```

### Auto Worker Service
```bash
NODE_ENV=dev
DATABASE_URL=<postgresql-connection-string>
GROUP_ID=<consumer-group-id>
TOPIC_NAME=<topic-name>
KAFKA_CLIENT_ID=<client-id>
KAFKA_BROKERS_NAME=<brokers-name>
APP_ENV=production
KAFKA_TOPIC=<topic-name>
AWS_BACKET_NAME=<s3-bucket-name>
AWS_REGION=<aws-region>
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-key>
```

## Kafka Configuration

The project uses Apache Kafka in KRaft mode (without Zookeeper):

- **Mode**: Combined broker and controller
- **Node ID**: 1
- **Listeners**: PLAINTEXT on port 9092
- **Replication Factor**: 1 (suitable for development)
- **Cluster ID**: MkU3OEVBNTcwNTJENDM2Qk

### Managing Kafka Topics

```bash
# List all topics
docker-compose exec kafka kafka-topics.sh --list --bootstrap-server localhost:9092

# Create a topic
docker-compose exec kafka kafka-topics.sh --create --topic your-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1

# Describe a topic
docker-compose exec kafka kafka-topics.sh --describe --topic your-topic --bootstrap-server localhost:9092

# Delete a topic
docker-compose exec kafka kafka-topics.sh --delete --topic your-topic --bootstrap-server localhost:9092
```

## Common Operations

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart a Specific Service
```bash
docker-compose restart primary-backend
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f worker

# Last 100 lines
docker-compose logs --tail=100 processor
```

### Scale Services
```bash
# Scale worker instances
docker-compose up -d --scale worker=3

# Scale auto_worker instances
docker-compose up -d --scale auto_worker=2
```

### Update Services
```bash
# Pull latest images
docker pull taraknathjana09/primary-backend:latest
docker pull taraknathjana09/worker:latest
# ... pull other images

# Recreate containers with new images
docker-compose up -d --force-recreate
```

## Troubleshooting

### Services Won't Start

**Check logs:**
```bash
docker-compose logs <service-name>
```

**Common issues:**
- Database connection failed: Verify DATABASE_URL
- Kafka not ready: Wait 30-60 seconds for Kafka initialization
- Port conflicts: Ensure ports 3000, 3004, 9092 are available

### Database Connection Issues

```bash
# Test database connection
docker-compose exec primary-backend sh
# Inside container:
# node -e "console.log(process.env.DATABASE_URL)"
```

**Solutions:**
- Verify PostgreSQL is running and accessible
- Check DATABASE_URL format: `postgresql://user:pass@host:port/db?sslmode=require`
- Ensure SSL mode is supported by your PostgreSQL instance
- Check firewall rules

### Kafka Connection Errors

**Check Kafka is running:**
```bash
docker-compose ps kafka
docker-compose logs kafka
```

**Verify Kafka connectivity:**
```bash
docker-compose exec worker sh
# Inside container:
# nc -zv kafka 9092
```

**Solutions:**
- Wait for Kafka to fully initialize (30-60 seconds)
- Verify KAFKA_BROKERS_NAME=kafka:9092
- Check if topics exist or enable auto-creation

### Worker Not Processing Messages

**Check worker logs:**
```bash
docker-compose logs -f worker
docker-compose logs -f auto_worker
```

**Verify Kafka messages:**
```bash
# Consume messages from topic
docker-compose exec kafka kafka-console-consumer.sh --topic workflow-events --from-beginning --bootstrap-server localhost:9092
```

**Solutions:**
- Verify correct Kafka topic names
- Check consumer group IDs
- Ensure messages are being produced

### High Memory Usage

```bash
# Check resource usage
docker stats

# Restart services
docker-compose restart
```

## Data Persistence

The project uses Docker volumes for data persistence:

- **kafka-data**: Stores Kafka logs and data

To backup Kafka data:
```bash
docker run --rm -v n8n-workflow_kafka-data:/data -v $(pwd):/backup ubuntu tar czf /backup/kafka-backup.tar.gz /data
```

To restore:
```bash
docker run --rm -v n8n-workflow_kafka-data:/data -v $(pwd):/backup ubuntu tar xzf /backup/kafka-backup.tar.gz -C /
```

## Production Deployment

### Security Best Practices

1. **Use Environment Files**
   - Never commit credentials to version control
   - Use `.env` files and add to `.gitignore`

2. **Secure Secrets**
   - Use Docker Secrets or AWS Secrets Manager
   - Rotate JWT secrets regularly
   - Use IAM roles instead of AWS access keys when possible

3. **Network Security**
   - Enable SSL/TLS for Kafka
   - Use private networks
   - Implement API authentication and rate limiting

4. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access by IP

### Performance Optimization

1. **Kafka Configuration**
   - Increase replication factor to 3
   - Set up multiple Kafka brokers
   - Configure appropriate retention policies
   - Tune batch size and compression

2. **Service Scaling**
   - Scale workers based on queue depth
   - Use load balancers for backend services
   - Monitor resource usage

3. **Database Optimization**
   - Add indexes for frequently queried fields
   - Enable connection pooling
   - Use read replicas for read-heavy workloads

### Monitoring and Logging

**Recommended tools:**
- Kafka monitoring: Kafka UI, Kafdrop, Confluent Control Center
- Application monitoring: Prometheus + Grafana
- Log aggregation: ELK Stack, Loki, or CloudWatch
- Health checks: Implement `/health` endpoints

**Setup basic monitoring:**
```bash
# Add to docker-compose.yml
  kafka-ui:
    image: provectuslabs/kafka-ui:latest
    ports:
      - "8080:8080"
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
```

## Maintenance

### Regular Tasks

1. **Monitor Disk Usage**
   ```bash
   docker system df
   docker volume ls
   ```

2. **Clean Up**
   ```bash
   # Remove unused images
   docker image prune -a
   
   # Remove unused volumes
   docker volume prune
   ```

3. **Backup Database**
   - Configure automated PostgreSQL backups
   - Test restore procedures regularly

4. **Update Dependencies**
   ```bash
   # Pull latest images
   docker-compose pull
   
   # Restart with new images
   docker-compose up -d
   ```

## Development

### Local Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Pull Docker images
4. Start services: `docker-compose up -d`
5. Check logs: `docker-compose logs -f`

### Testing

```bash
# Run tests in specific service
docker-compose exec primary-backend npm test

# Run integration tests
docker-compose exec worker npm run test:integration
```

## Support & Contributing

### Getting Help

- Check the [Troubleshooting](#troubleshooting) section
- Review logs: `docker-compose logs -f`
- Open an issue on GitHub

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Specify your license]

## Contact

For questions or support, contact:
- GitHub: [taraknathjana09](https://github.com/taraknathjana09)
- Docker Hub: [taraknathjana09](https://hub.docker.com/u/taraknathjana09)

## Acknowledgments

- Apache Kafka for message streaming
- Docker for containerization
- PostgreSQL for database
- AWS S3 for object storage