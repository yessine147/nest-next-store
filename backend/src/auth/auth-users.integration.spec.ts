import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  getRepositoryToken,
} from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { dbOptions } from '../database/orm-config';

jest.setTimeout(30000);

describe('Auth + Users integration', () => {
  let app: INestApplication;
  let authService: AuthService;
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  const testEmail = 'integration@example.com';
  const testPassword = 'password123';

  beforeAll(async () => {
    const testDatabaseName =
      process.env.DB_NAME_TEST ||
      `${(dbOptions.database as string) || 'nest_next_store_test'}`;

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          ...(dbOptions as unknown as Record<string, unknown>),
          database: testDatabaseName,
        } as TypeOrmModuleOptions),
        AuthModule,
        UsersModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    authService = moduleRef.get(AuthService);
    usersService = moduleRef.get(UsersService);
    usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    // Clean users table between tests so we start from a known state.
    // Using clear() here avoids TypeORM's "Empty criteria(s) are not allowed" error.
    await usersRepository.clear();
  });

  afterAll(async () => {
    // Final cleanup so no users remain after the suite finishes
    await usersRepository.clear();
    await app.close();
  });

  it('registers a user and persists it to the database', async () => {
    const created = await authService.register(testEmail, testPassword);

    const loaded = await usersService.findByEmail(testEmail);

    expect(created.id).toBeDefined();
    expect(loaded).not.toBeNull();
    expect(loaded?.email).toBe(testEmail);
    // passwordHash should not equal the plain password (bcrypt hash applied)
    expect(loaded?.passwordHash).not.toBe(testPassword);
  });

  it('validates a user against the stored hashed password', async () => {
    await authService.register(testEmail, testPassword);

    const validated = await authService.validateUser(testEmail, testPassword);

    expect(validated).toBeDefined();
    expect(validated.email).toBe(testEmail);
  });
});
