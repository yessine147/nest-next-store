import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { dbOptions } from './orm-config';

config();

export const AppDataSource = new DataSource(dbOptions);
