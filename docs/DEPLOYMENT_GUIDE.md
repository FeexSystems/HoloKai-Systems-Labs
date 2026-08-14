# HoloKai Systems Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the HoloKai Systems platform across different environments. HoloKai is a multi-tenant, multi-region distributed system with edge computing, serverless functions, and AI-powered knowledge retrieval.

## Prerequisites

### Infrastructure Requirements

- **Cloud Providers**: 
  - Google Cloud Platform (GCP) for primary infrastructure
  - Cloudflare Workers for edge routing
  - Firebase for hosting and authentication
  - Railway/Render for containerized services

- **Development Tools**:
  - Node.js 18+ and pnpm
  - Python 3.11+ with pip
  - Docker and Docker Compose
  - kubectl for Kubernetes deployments
  - Terraform for infrastructure provisioning

- **Environment Variables**:
  See `.env.example` files in each app directory

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Edge Layer (Cloudflare)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ AI Router   │  │ Geo Router   │  │ MFE Manifest │      │
│  │ Worker       │  │ Worker       │  │ Worker       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Web Archive  │  │ Web Cart     │  │ BFF API      │      │
│  │ (Next.js)    │  │ (Next.js)    │  │ (Node.js)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Firebase     │  │ Vector DB    │      │
│  │ (Neon/Railway)│  │ Firestore   │  │ (pgvector)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   AI/ML Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Python       │  │ Knowledge    │  │ RAG Engine   │      │
│  │ Engine       │  │ Base         │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Environments

### 1. Development Environment

#### Local Development Setup

```bash
# Clone repository
git clone https://github.com/FeexSystems/HoloKai-Systems-Labs.git
cd HoloKai-Systems-Labs

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local configuration

# Start development servers
pnpm dev
```

#### Local Services with Docker Compose

```bash
# Start PostgreSQL and other services
docker-compose up -d

# Run database migrations
pnpm db:push

# Seed knowledge base
cd services/python-engine
python knowledge_base_comprehensive.py
```

### 2. Staging Environment

#### Infrastructure Setup

```bash
# Configure Terraform
cd infra/terraform
terraform init
terraform plan -var-file=staging.tfvars
terraform apply -var-file=staging.tfvars
```

#### Application Deployment

```bash
# Build applications
pnpm build

# Deploy to staging
pnpm deploy:staging

# Run database migrations
pnpm db:migrate:staging
```

#### Edge Workers Deployment

```bash
# Deploy Cloudflare Workers
cd edge/ai-router-worker
pnpm deploy:staging

cd ../geo-router-worker
pnpm deploy:staging

cd ../mfe-manifest-worker
pnpm deploy:staging
```

### 3. Production Environment

#### Pre-Deployment Checklist

- [ ] All tests passing (`pnpm test`)
- [ ] Security audit completed (`pnpm audit`)
- [ ] Performance benchmarks met
- [ ] Database backups verified
- [ ] Monitoring and alerting configured
- [ ] CDN cache invalidated
- [ ] DNS records updated
- [ ] SSL certificates valid

#### Production Deployment

```bash
# Tag release
git tag -a v1.0.0 -m "Production release v1.0.0"
git push origin v1.0.0

# Deploy infrastructure
cd infra/terraform
terraform apply -var-file=production.tfvars

# Deploy applications
pnpm deploy:production

# Deploy edge workers
cd edge
pnpm deploy:production

# Run database migrations with backup
pnpm db:migrate:production --backup
```

#### Blue-Green Deployment Strategy

```bash
# Deploy to green environment
pnpm deploy:production:green

# Run smoke tests
pnpm test:smoke:production:green

# Switch traffic
kubectl patch service holokai-web -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for 30 minutes
# If issues: rollback to blue
kubectl patch service holokai-web -p '{"spec":{"selector":{"version":"blue"}}}'
```

## Component-Specific Deployment

### Edge Workers (Cloudflare)

#### AI Router Worker

```bash
cd edge/ai-router-worker
npm install
npm run deploy
```

Configuration in `wrangler.jsonc`:
- Environment variables
- KV namespaces
- D1 database bindings
- Route patterns

#### Geo Router Worker

```bash
cd edge/geo-router-worker
npm install
npm run deploy
```

#### MFE Manifest Worker

```bash
cd edge/mfe-manifest-worker
npm install
npm run deploy
```

### Next.js Applications

#### Web Archive

```bash
cd apps/web-archive
pnpm install
pnpm build
pnpm start
```

Environment variables:
- `NEXT_PUBLIC_API_URL`
- `DATABASE_URL`
- `FIREBASE_API_KEY`

#### Web Cart

```bash
cd apps/web-cart
pnpm install
pnpm build
pnpm start
```

#### BFF API

```bash
cd apps/bff
pnpm install
pnpm build
pnpm start
```

### Firebase Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### Python AI Engine

```bash
cd services/python-engine
pip install -r requirements.txt
python agents.py
```

## Database Deployment

### PostgreSQL Setup

```bash
# Using Neon
psql $DATABASE_URL -f src/db/schema.sql

# Using Railway
railway login
railway link
railway run psql < src/db/schema.sql
```

### Vector Database Setup

```bash
# Enable pgvector
psql $DATABASE_URL -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Create vector tables
psql $DATABASE_URL -f docs/postgres_pgvector_schema.sql
```

### Knowledge Base Import

```bash
cd services/python-engine
python knowledge_base_comprehensive.py --import
```

## Monitoring and Observability

### Application Monitoring

```bash
# Install monitoring agents
pnpm add @sentry/nextjs @sentry/node

# Configure Sentry
# Add DSN to environment variables
```

### Logging

```bash
# Configure structured logging
# Logs sent to CloudWatch/DataDog
```

### Metrics

```bash
# Set up Prometheus metrics
# Configure Grafana dashboards
# See observability/dashboards/
```

### Alerting

Configure alerts for:
- Error rate > 1%
- Response time P95 > 2s
- Database connection pool exhaustion
- Edge worker errors
- AI service failures

## Security Configuration

### Environment Variables

Never commit secrets. Use:
- `.env` files (gitignored)
- Secret management services
- CI/CD secret stores

### API Keys

Rotate regularly:
- OpenAI API keys
- Firebase service account keys
- Cloudflare API tokens

### CORS Configuration

```typescript
// apps/web-archive/next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://holokai.systems' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
        ],
      },
    ]
  },
}
```

## Scaling Strategies

### Horizontal Scaling

```bash
# Kubernetes HPA
kubectl autoscale deployment holokai-web --cpu-percent=70 --min=3 --max=10
```

### Vertical Scaling

```bash
# Adjust resource limits
kubectl set resources deployment holokai-web --limits=cpu=2,memory=4Gi
```

### Edge Scaling

Cloudflare Workers auto-scale. Configure:
- Rate limits
- Cache TTL
- Geographic distribution

## Rollback Procedures

### Quick Rollback

```bash
# Revert to previous git tag
git checkout v0.9.0
pnpm deploy:production
```

### Database Rollback

```bash
# Restore from backup
pg_restore -d $DATABASE_URL backups/production_$(date +%Y%m%d).sql
```

### Edge Worker Rollback

```bash
cd edge/ai-router-worker
wrangler rollback
```

## Performance Optimization

### CDN Configuration

- Cache static assets
- Enable Brotli compression
- Configure image optimization

### Database Optimization

```sql
-- Add indexes
CREATE INDEX idx_embeddings_vector_id ON embeddings USING ivfflat (vector_id vector_cosine_ops);
```

### Edge Caching

```javascript
// Configure cache headers
export async function GET(request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

## Troubleshooting

See [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md) for common issues and solutions.

## Support

- Documentation: [docs/](./)
- Issues: GitHub Issues
- Emergency: on-call rotation via PagerDuty

## Appendix

### Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `FIREBASE_API_KEY` | Firebase API key | Yes | - |
| `NEXT_PUBLIC_API_URL` | API base URL | Yes | - |
| `NODE_ENV` | Environment | Yes | development |

### Port Mappings

| Service | Port | Notes |
|---------|------|-------|
| Web Archive | 3000 | Next.js dev server |
| Web Cart | 3001 | Next.js dev server |
| BFF API | 3002 | Express server |
| Python Engine | 8000 | FastAPI server |

### Service Dependencies

```
Edge Workers → BFF API → PostgreSQL
Web Apps → Edge Workers → AI Services
Python Engine → PostgreSQL + Vector DB
```
