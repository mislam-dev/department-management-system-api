import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AcademicModule } from './modules/academic/academic.module';
import { CoreAttendanceModule } from './modules/attendance/core-attendance.module';
import { FinanceModule } from './modules/finance/finance.module';
import { IdentityModule } from './modules/identity/identity.module';
import { MessengerModule } from './modules/messenger/messenger.module';
import { ReportingModule } from './modules/reporting/reporting.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CoreModule,
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('bull.host'),
          port: config.get<number>('bull.port'),
        },
      }),
      inject: [ConfigService],
    }),
    AcademicModule,
    IdentityModule,
    CoreAttendanceModule,
    ReportingModule,
    FinanceModule,
    MessengerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
