# Nest Next Store

Full-stack e-commerce admin dashboard built with NestJS (backend) and Next.js (frontend).

## 🏗️ Project Structure

```
nest-next-store/
├── backend/          # NestJS API server
├── frontend/         # Next.js admin dashboard
└── .github/          # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file (copy from .env.example)
# Configure your PostgreSQL connection

npm run start:dev
```

Backend runs on `http://localhost:3000`
- API: `http://localhost:3000/api`
- Swagger Docs: `http://localhost:3000/api/docs`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

npm run dev
```

Frontend runs on `http://localhost:3001`

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm test

# Integration tests
npm test -- src/auth/auth-users.integration.spec.ts

# Coverage
npm run test:cov
```

### Frontend E2E Tests

```bash
cd frontend

# Install Playwright browsers (first time only)
npx playwright install chromium

# Run E2E tests (requires both backend and frontend running)
npm run test:e2e
```

## 🔄 CI/CD

GitHub Actions workflows automatically run on push/PR:

- **Backend Tests**: Unit + Integration tests with PostgreSQL service
- **Frontend Tests**: E2E tests with Playwright (requires backend running)

Workflows:
- `.github/workflows/ci.yml` - Main CI workflow
- `.github/workflows/backend.yml` - Backend-specific tests
- `.github/workflows/frontend.yml` - Frontend E2E tests

## 📦 Features

- ✅ User authentication (JWT)
- ✅ Product CRUD operations
- ✅ Image upload (local storage)
- ✅ Protected routes
- ✅ Responsive admin dashboard
- ✅ API documentation (Swagger)
- ✅ Unit & Integration tests
- ✅ E2E tests (Playwright)

## 🛠️ Tech Stack

**Backend:**
- NestJS
- TypeORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Axios
- Playwright (E2E)

## 📝 Environment Variables

### Backend (.env)
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nest_next_store
DB_NAME_TEST=nest_next_store_test
JWT_SECRET=your-secret-key
APP_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## 📄 License

UNLICENSED
