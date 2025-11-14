import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Auth0JWTGuard } from './auth/guards/auth0-jwt.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { RolePermissionsGuard } from './auth/guards/role-permissions.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import auth0Config from './config/auth0.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auth0Config],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: Auth0JWTGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolePermissionsGuard,
    },
  ],
})
export class AppModule {}
