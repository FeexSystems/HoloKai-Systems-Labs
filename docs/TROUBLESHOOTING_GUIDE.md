# HoloKai Systems Troubleshooting Guide

## Overview

This guide provides solutions to common issues encountered when developing, deploying, and operating the HoloKai Systems platform.

## Quick Reference

| Issue | Section |
|-------|---------|
| Build failures | Build Issues |
| Database connection errors | Database Issues |
| Edge worker errors | Edge Worker Issues |
| AI service failures | AI/ML Issues |
| Performance problems | Performance Issues |
| Authentication errors | Authentication Issues |

## Build Issues

### Node.js Version Incompatibility

**Symptom**: Build fails with module resolution errors

**Solution**:
```bash
# Check Node version
node --version  # Should be 18+

# Install correct version using nvm
nvm install 18
nvm use 18

# Clear cache and reinstall
rm -rf node_modules .turbo
pnpm install
```

### TypeScript Compilation Errors

**Symptom**: Type errors during build

**Solution**:
```bash
# Check TypeScript version
pnpm list typescript

# Regenerate type definitions
pnpm build:types

# Check for circular dependencies
pnpm check:circular
```

### Dependency Conflicts

**Symptom**: `ERESOLVE` unable to resolve dependency tree

**Solution**:
```bash
# Update lockfile
rm pnpm-lock.yaml
pnpm install

# Check for peer dependency issues
pnpm why <package-name>

# Force resolution if necessary
# Add to package.json:
"pnpm": {
  "overrides": {
    "package-name": "version"
  }
}
```

### Turbo Build Cache Issues

**Symptom**: Stale build artifacts, unexpected build failures

**Solution**:
```bash
# Clear Turbo cache
rm -rf .turbo
pnpm build --force

# Clear all caches
pnpm store prune
```

## Database Issues

### Connection Refused

**Symptom**: `Error: connect ECONNREFUSED`

**Solution**:
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Start database
docker-compose up -d postgres

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Migration Failures

**Symptom**: Migration script fails or hangs

**Solution**:
```bash
# Check migration status
pnpm db:status

# Rollback last migration
pnpm db:rollback

# Force reset (development only)
pnpm db:reset

# Check for locked migrations
psql $DATABASE_URL -c "SELECT * FROM drizzle_migrations"
```

### Connection Pool Exhaustion

**Symptom**: `Error: remaining connection slots are reserved`

**Solution**:
```bash
# Check active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Kill idle connections
psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';"

# Increase pool size in connection string
# DATABASE_URL="postgres://user:pass@host:5432/db?pool_size=20"
```

### Vector Index Issues

**Symptom**: Slow vector similarity search

**Solution**:
```sql
-- Check if ivfflat index exists
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'embeddings';

-- Recreate index
DROP INDEX IF EXISTS idx_embeddings_vector;
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (vector vector_cosine_ops) WITH (lists = 100);

-- Vacuum analyze
VACUUM ANALYZE embeddings;
```

## Edge Worker Issues

### Worker Deployment Failures

**Symptom**: `wrangler deploy` fails

**Solution**:
```bash
# Check authentication
wrangler whoami

# Re-authenticate
wrangler login

# Validate wrangler.jsonc
wrangler dev --dry-run

# Check for syntax errors
npx wrangler build
```

### Runtime Errors in Production

**Symptom**: 500 errors from edge workers

**Solution**:
```bash
# Check worker logs
wrangler tail

# Check for uncaught exceptions
# Add error boundaries in worker code

# Test locally
wrangler dev
```

### KV Namespace Not Found

**Symptom**: `Error: KV namespace not found`

**Solution**:
```bash
# List KV namespaces
wrangler kv:namespace list

# Create missing namespace
wrangler kv:namespace create "HOLOKAI_CACHE"

# Update wrangler.jsonc with binding ID
```

### Route Pattern Conflicts

**Symptom**: Routes not matching expected patterns

**Solution**:
```bash
# Check current routes
wrangler routes list

# Remove conflicting routes
wrangler routes delete <route-id>

# Re-deploy with correct patterns
wrangler deploy
```

## AI/ML Issues

### OpenAI API Rate Limits

**Symptom**: `Error: 429 Too Many Requests`

**Solution**:
```bash
# Check API key quota
# Visit https://platform.openai.com/account/limits

# Implement exponential backoff
# Add to code:
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};
```

### Embedding Generation Failures

**Symptom**: Vector embeddings not generating

**Solution**:
```bash
# Check API key validity
echo $OPENAI_API_KEY

# Test with simple request
curl https://api.openai.com/v1/embeddings \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"test","model":"text-embedding-3-small"}'

# Check model availability
# Some models may be region-restricted
```

### RAG Retrieval Poor Results

**Symptom**: Irrelevant search results

**Solution**:
```bash
# Check embedding similarity
# Query with known text and verify results

# Adjust similarity threshold
# In Python:
results = vector_store.similarity_search_with_score(query, k=5, score_threshold=0.7)

# Re-index knowledge base
cd services/python-engine
python knowledge_base_comprehensive.py --reindex
```

### Python Service Not Responding

**Symptom**: AI engine timeouts

**Solution**:
```bash
# Check if service is running
ps aux | grep python

# Check logs
tail -f logs/python-engine.log

# Restart service
pkill -f "python agents.py"
python services/python-engine/agents.py &

# Check port availability
netstat -tulpn | grep 8000
```

## Performance Issues

### Slow Page Load Times

**Symptom**: Initial page load > 3 seconds

**Solution**:
```bash
# Analyze bundle size
pnpm build:analyze

# Enable compression
# Add to next.config.js:
compress: true

# Optimize images
# Use next/image with proper sizing

# Enable static generation where possible
# Change getServerSideProps to getStaticProps
```

### Memory Leaks

**Symptom**: Memory usage increases over time

**Solution**:
```bash
# Check memory usage
node --max-old-space-size=4096 node_modules/.bin/next build

# Profile memory
node --inspect node_modules/.bin/next dev

# Check for event listener leaks
# Ensure cleanup in useEffect

# Monitor with Chrome DevTools
# Performance > Memory > Take heap snapshot
```

### Database Query Slow

**Symptom**: API endpoints slow due to database queries

**Solution**:
```bash
# Enable query logging
# Add to DATABASE_URL: ?loglevel=debug

# Analyze slow queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Add missing indexes
# Use EXPLAIN ANALYZE to identify missing indexes

# Optimize N+1 queries
# Use joins or include relations
```

### CDN Cache Issues

**Symptom**: Stale content served from CDN

**Solution**:
```bash
# Purge Cloudflare cache
wrangler cache purge --url=https://holokai.systems/*

# Invalidate Firebase hosting cache
firebase hosting:channel:deploy

# Set proper cache headers
# Cache-Control: public, max-age=31536000, immutable
```

## Authentication Issues

### Firebase Auth Errors

**Symptom**: `Error: auth/invalid-api-key`

**Solution**:
```bash
# Verify Firebase config
cat apps/web-archive/.env.local | grep FIREBASE

# Regenerate API key
# Visit Firebase Console > Project Settings > General

# Check domain whitelist
# Firebase Console > Authentication > Authorized domains
```

### Session Token Expiration

**Symptom**: User logged out unexpectedly

**Solution**:
```bash
# Check token refresh logic
# Ensure onTokenRefreshed handler is set up

# Adjust session timeout
# Firebase Console > Authentication > Sign-in method

# Implement token refresh
const refreshToken = async () => {
  const user = auth.currentUser;
  if (user) await user.getIdToken(true);
};
```

### CORS Errors

**Symptom**: Browser console shows CORS policy error

**Solution**:
```typescript
// Update CORS configuration
// In next.config.js or middleware:
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Add OPTIONS handler
export async function OPTIONS(request: Request) {
  return new Response(null, { headers: corsHeaders })
}
```

## Deployment Issues

### Build Fails in CI/CD

**Symptom**: GitHub Actions workflow fails

**Solution**:
```bash
# Check workflow logs
# GitHub Actions tab > failed run

# Test locally with same environment
# Use act to run GitHub Actions locally
act push

# Check environment variables
# Ensure all secrets are set in repository settings
```

### Docker Build Failures

**Symptom**: `docker build` fails

**Solution**:
```bash
# Check Dockerfile syntax
docker build --no-cache -t holokai-test .

# Check base image availability
docker pull node:18-alpine

# Clear Docker cache
docker system prune -a

# Check for layer size issues
docker history holokai-test
```

### Kubernetes Pod Crashes

**Symptom**: Pods in CrashLoopBackOff state

**Solution**:
```bash
# Check pod logs
kubectl logs <pod-name> --previous

# Check pod events
kubectl describe pod <pod-name>

# Check resource limits
kubectl get pod <pod-name> -o yaml | grep -A 5 resources

# Increase resources if needed
kubectl set resources deployment <deployment> --limits=cpu=1,memory=2Gi
```

## Development Environment Issues

### Hot Reload Not Working

**Symptom**: Changes not reflected in browser

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
pnpm dev

# Check file watchers
# On Linux, increase inotify limit:
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
```

### Port Already in Use

**Symptom**: `Error: Port 3000 is already in use`

**Solution**:
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 pnpm dev
```

### Environment Variables Not Loading

**Symptom**: `undefined` values from process.env

**Solution**:
```bash
# Check .env file exists
ls -la .env

# Verify file format (no spaces around =)
# Correct: KEY=value
# Wrong: KEY = value

# Restart server after changes
# Environment variables loaded at startup

# For Next.js, prefix with NEXT_PUBLIC_ for client-side access
```

## Monitoring and Debugging

### Enable Debug Logging

```bash
# Set log level
export LOG_LEVEL=debug

# Enable verbose mode
pnpm dev --verbose

# Check specific package logs
DEBUG=* pnpm dev
```

### Profile Application

```bash
# CPU profiling
node --prof node_modules/.bin/next dev

# Memory profiling
node --heap-prof node_modules/.bin/next dev

# Generate flame graph
# Use 0x for visualization
npm install -g 0x
0x build/.next/trace.log
```

### Network Debugging

```bash
# Check DNS resolution
nslookup holokai.systems

# Test connectivity
curl -v https://holokai.systems

# Check SSL certificate
openssl s_client -connect holokai.systems:443

# Trace route
traceroute holokai.systems
```

## Emergency Procedures

### Database Corruption

```bash
# Stop all writes
# Scale down application to 0

# Create backup
pg_dump $DATABASE_URL > emergency_backup.sql

# Restore from last known good backup
pg_restore -d $DATABASE_URL backups/production_$(date +%Y%m%d -d 1 day).sql

# Verify data integrity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM embeddings;"
```

### Security Incident

```bash
# Rotate all API keys
# Update .env files

# Revoke compromised sessions
# Firebase Console > Authentication > Users

# Check for unauthorized access
# Review logs for suspicious activity

# Enable additional monitoring
# Set up alerts for unusual patterns
```

### Complete Outage

```bash
# Check status page
# Update users via communication channels

# Identify affected services
# Use health check endpoints

# Failover to backup region
# Update DNS if needed

# Document incident
# Create post-mortem
```

## Getting Help

### Internal Resources

- Architecture documentation: `docs/ARCHITECTURE.md`
- API documentation: `docs/API_DOCUMENTATION.md`
- Component map: `docs/COMPONENT_MAP.md`

### External Resources

- Next.js documentation: https://nextjs.org/docs
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- PostgreSQL: https://www.postgresql.org/docs/
- OpenAI API: https://platform.openai.com/docs

### Reporting Issues

When reporting issues, include:
1. Environment (development/staging/production)
2. Error messages and stack traces
3. Steps to reproduce
4. Expected vs actual behavior
5. Configuration (sanitized)

### Escalation Path

1. Check this guide first
2. Search existing GitHub issues
3. Create new issue with template
4. Contact on-call for production issues
5. Emergency: page engineering lead

## Appendix

### Useful Commands

```bash
# System health check
pnpm health:check

# Full test suite
pnpm test

# Lint and format
pnpm lint
pnpm format

# Database operations
pnpm db:push
pnpm db:studio
pnpm db:seed

# Deployment
pnpm deploy:dev
pnpm deploy:staging
pnpm deploy:production
```

### Log Locations

| Component | Log Location |
|-----------|--------------|
| Next.js apps | `.next/server/logs` |
| Edge workers | Cloudflare Dashboard |
| Python engine | `logs/python-engine.log` |
| PostgreSQL | Database logs |
| Firebase | Firebase Console |

### Health Check Endpoints

- `/api/health` - Overall system health
- `/api/health/db` - Database connectivity
- `/api/health/ai` - AI service status
- `/api/health/cache` - Cache status
