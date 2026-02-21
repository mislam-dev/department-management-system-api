import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AcademicModule } from './modules/academic/academic.module';
import { CoreAttendanceModule } from './modules/attendance/core-attendance.module';
import { FinanceModule } from './modules/finance/finance.module';
import { IdentityModule } from './modules/identity/identity.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { MessengerModule } from './modules/messenger/messenger.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CoreModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
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
