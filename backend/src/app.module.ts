import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { dbOptions } from './database/orm-config';
import { ThrottleBehindProxyGuard } from './common/guards/throttle-behind-proxy.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.development'],
    }),
    // Rate limiting: Protect against brute force and DDoS attacks
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // Time window in milliseconds (1 minute)
        limit: 100, // Maximum number of requests per time window
      },
    ]),
    TypeOrmModule.forRoot(dbOptions),
    AuthModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally to all routes
    // Uses custom guard that works behind proxies (nginx, load balancers)
    {
      provide: APP_GUARD,
      useClass: ThrottleBehindProxyGuard,
    },
  ],
})
export class AppModule {}
