# Dreemz Backend Challenge (PostgreSQL Edition)

**Candidate Setup**: Node.js + TypeScript + PostgreSQL

## Features
- **Real Database**: Uses a `pg.Pool` to connect to a PostgreSQL instance.
- **Efficient Querying**: Uses `LEFT JOIN` and SQL exclusion to find unseen posts suitable for 100k+ users.
- **Humanized Code**: Pragmatic architecture decisions and explicit trade-off comments.

## Setup Instructions

### 1. Database Setup
You need a running PostgreSQL instance. The easiest way is using Docker:
```bash
docker run --name dreemz-postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:latest
```

Initialize the Schema and Seed Data:
```bash
# If you have psql installed
psql -h localhost -U postgres -f scripts/init_db.sql

# Or using docker exec
docker exec -i dreemz-postgres psql -U postgres < scripts/init_db.sql
```
*Note: The script creates the `dreemz` DB (if configured) or uses default `postgres` database and creates tables `users`, `posts`, `user_viewed_posts`.*

### 2. Configuration
Copy `.env.example` to `.env` and adjust the credentials if necessary.
```bash
cp .env.example .env
```

### 3. Run Application
```bash
npm install
npm run dev
```

### 4. Verify
Run the automated flow script:
```bash
npx ts-node scripts/verify_flow.ts
```

## Architecture Answers
See [docs/Dreemz_Solutions.md](./docs/Dreemz_Solutions.md) for the detailed design document.
