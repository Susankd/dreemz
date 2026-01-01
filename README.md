# Dreemz Backend Challenge (PostgreSQL Edition)

**Candidate Setup**: Node.js + TypeScript + PostgreSQL

## Features
- **Real Database**: Uses a `pg.Pool` to connect to a PostgreSQL instance.
- **Efficient Querying**: Uses `LEFT JOIN` and SQL exclusion to find unseen posts suitable for 100k+ users.

## Setup Instructions

### 1. Database Setup
You need a running PostgreSQL instance.  

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
