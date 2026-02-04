import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: 1,
        email: 'user@example.com',
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email is already in use',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto.email, dto.password);
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expiresIn: '1h',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiBody({ type: LoginDto })
  async login(@CurrentUser() user: User, @Body() dto: LoginDto) {
    return this.authService.login(user, dto.rememberMe);
  }
}
