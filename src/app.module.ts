import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ActivityModule } from './activity/activity.module';
import { AiModule } from './ai/ai.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { Auth0JWTGuard } from './auth/guards/auth0-jwt.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { RolePermissionsGuard } from './auth/guards/role-permissions.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Auth0Module } from './auth0/auth0.module';
import { auth0_m2m } from './config/auth0-m2m.config';
import auth0Config from './config/auth0.config';
import { databaseConfig } from './config/database.config';
import { CourseModule } from './course/course.module';
import { CourseScheduleModule } from './course_schedule/course_schedule.module';
import { NoticeModule } from './notice/notice.module';
import { ReportModule } from './report/report.module';
import { SemesterModule } from './semester/semester.module';
import { StudentModule } from './student/student.module';
import { TeacherAttendanceModule } from './teacher-attendance/teacher-attendance.module';
import { TeacherModule } from './teacher/teacher.module';
import { TeacherUnavailabilityModule } from './teacher_unavailability/teacher_unavailability.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auth0Config, databaseConfig, auth0_m2m],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    Auth0Module,
    SemesterModule,
    TeacherModule,
    StudentModule,
    CourseModule,
    CourseScheduleModule,
    AttendanceModule,
    ActivityModule,
    NoticeModule,
    ReportModule,
    TeacherUnavailabilityModule,
    TeacherAttendanceModule,
    AiModule,
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
