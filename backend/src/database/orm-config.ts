import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

// Load .env file before reading environment variables
config();

export const dbOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nest_next_store',
  entities: [User, Product],
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
};
