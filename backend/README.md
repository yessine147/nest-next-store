<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Backend API for `nest-next-store`, built with NestJS, PostgreSQL, and JWT authentication. It provides user registration/login and a secured products CRUD that will be consumed by a future Next.js frontend.

## Project setup

```bash
cd backend
npm install
cp .env.example .env       # then edit values if needed
```

## Running the API

```bash
# development
npm run start:dev

# production build + start
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000/api`.

## Database & migrations

- Config file: `src/database/data-source.ts`
- Entities: `User` (`src/users/user.entity.ts`), `Product` (`src/products/product.entity.ts`)

Available migration scripts:

```bash
# generate a new migration (after changing entities)
npm run migration:generate

# run pending migrations
npm run migration:run
```

Make sure your PostgreSQL server is running and your `.env` is correct before running migrations.

## Auth endpoints

Base path: `/api/auth`

- **POST** `/register`  
  - Body: `{ "email": string, "password": string (min 8 chars) }`  
  - Response: `{ id, email, createdAt }`

- **POST** `/login`  
  - Body: `{ "email": string, "password": string }`  
  - Response: `{ "accessToken": string }` (JWT Bearer token)

## Products endpoints

Base path: `/api/products`

- **GET** `/` – list all products (public)
- **GET** `/:id` – get product by id (public)
- **POST** `/` – create product (requires `Authorization: Bearer <token>`)
- **PATCH** `/:id` – update product (requires auth)
- **DELETE** `/:id` – delete product (requires auth)

### Product payload

```json
{
  "name": "Example product",
  "description": "Optional description",
  "price": 19.99
}
```

`id`, `createdAt`, and `updatedAt` are managed by the database.

## Production notes

- Set a strong `JWT_SECRET` in `.env`.
- Use separate `.env` files or environment variables per environment (dev/stage/prod).
- Configure a production-grade PostgreSQL instance and run migrations as part of your deployment pipeline.
