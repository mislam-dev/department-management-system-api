import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './core/config/config.module';
import { CoreAttendanceModule } from './modules/attendance/core-attendance.module';
import { IdentityModule } from './modules/identity/identity.module';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';

@Module({
  imports: [
    ConfigModule,
    CoreAttendanceModule,
    IdentityModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.getOrThrow<string>('database.host'),
          port: config.getOrThrow<number>('database.port'),
          username: config.getOrThrow<string>('database.username'),
          password: config.getOrThrow<string>('database.password'),
          database: config.getOrThrow<string>('database.name'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
