import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { QueryFailedError } from 'typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string): Promise<User> {
    try {
      const existing = await this.usersService.findByEmail(email);
      if (existing) {
        throw new ConflictException('Email is already in use');
      }
      return await this.usersService.create(email, password);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to register user: ${error.message}`,
        error.stack,
      );
      if (error instanceof QueryFailedError) {
        // Handle unique constraint violations
        if (
          error.message.includes('unique') ||
          error.message.includes('duplicate')
        ) {
          throw new ConflictException('Email is already in use');
        }
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isValid = await compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(
    user: User,
    rememberMe?: boolean,
  ): Promise<{ accessToken: string; expiresIn: string }> {
    const payload = { sub: user.id, email: user.email };
    const expiresIn = rememberMe ? '7d' : '1h';
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    return { accessToken, expiresIn };
  }
}
