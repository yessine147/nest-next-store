import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    passwordHash: 'hashedPassword',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.register.mockResolvedValue(mockUser);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
      );
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        createdAt: mockUser.createdAt,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      authService.register.mockRejectedValue(
        new ConflictException('Email is already in use'),
      );

      await expect(controller.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false,
      };

      authService.login.mockResolvedValue({
        accessToken: 'mock.token',
        expiresIn: '1h',
      });

      const result = await controller.login(mockUser, loginDto);

      expect(authService.login).toHaveBeenCalledWith(mockUser, false);
      expect(result).toEqual({
        accessToken: 'mock.token',
        expiresIn: '1h',
      });
    });

    it('should return access token with extended expiration if rememberMe is true', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: true,
      };

      authService.login.mockResolvedValue({
        accessToken: 'mock.token',
        expiresIn: '7d',
      });

      const result = await controller.login(mockUser, loginDto);

      expect(authService.login).toHaveBeenCalledWith(mockUser, true);
      expect(result).toEqual({
        accessToken: 'mock.token',
        expiresIn: '7d',
      });
    });
  });
});
