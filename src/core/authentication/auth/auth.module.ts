import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { Auth0Service } from 'src/core/authentication/auth0/auth0.service';
import { StudentModule } from 'src/modules/identity/student/student.module';
import { TeacherModule } from 'src/modules/identity/teacher/teacher.module';
import { UserModule } from 'src/modules/identity/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth0JWTGuard } from './guards/auth0-jwt.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolePermissionsGuard } from './guards/role-permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { Auth0JWTStrategy } from './strategy/auth0-jwt.strategy';

@Module({
  providers: [
    AuthService,
    Auth0JWTStrategy,
    Auth0Service,
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
  imports: [PassportModule, UserModule, StudentModule, TeacherModule],
  controllers: [AuthController],
})
export class AuthModule {}
