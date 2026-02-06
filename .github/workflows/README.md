# CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### `ci.yml` - Main CI Pipeline

Runs on every push and pull request to `master`/`main` branches.

**Jobs:**
1. **Backend Tests** - Runs unit and integration tests
2. **Frontend Tests** - Runs E2E tests with Playwright

### `backend.yml` - Backend Tests

Runs when backend code changes:
- Lints TypeScript code
- Runs unit tests (Jest)
- Runs integration tests
- Builds the application

**Services:**
- PostgreSQL 15 (for integration tests)

### `frontend.yml` - Frontend Tests

Runs when frontend code changes:
- Lints TypeScript/React code
- Builds backend and frontend
- Starts both servers
- Runs Playwright E2E tests

**Services:**
- PostgreSQL 15 (for backend)

## Environment Variables

CI workflows use these environment variables (set in workflow files):

**Backend:**
- `DB_HOST=localhost`
- `DB_PORT=5432`
- `DB_USER=postgres`
- `DB_PASSWORD=postgres`
- `DB_NAME=nest_next_store_test`
- `JWT_SECRET=test-jwt-secret-key-for-ci`
- `PORT=3000`

**Frontend:**
- `NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api`
- `E2E_BASE_URL=http://localhost:3001`
- `PORT=3001`

## Running Locally

To test CI workflows locally, you can use [act](https://github.com/nektos/act):

```bash
# Install act
# Then run workflows locally
act -j backend
act -j frontend
```

## Troubleshooting

**Backend tests failing:**
- Ensure PostgreSQL service is healthy
- Check database connection settings
- Verify test database exists

**Frontend E2E tests failing:**
- Ensure backend is running and accessible
- Check Playwright browsers are installed
- Verify both servers start successfully
- Check network connectivity between services
