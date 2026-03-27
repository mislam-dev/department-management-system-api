import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './core/config/config.module';
import { FinanceModule } from './modules/finance/finance.module';
import { ReportModule } from './modules/reporting/report/report.module';
import { RegisterServiceController } from './register_service.controller';
import { RegisterServiceService } from './register_service.service';

@Module({
  imports: [
    ConfigModule,
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
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          connection: {
            host: config.get<string>('bull.host'),
            port: config.get<number>('bull.port'),
          },
        };
      },
      inject: [ConfigService],
    }),
    FinanceModule,
    ReportModule,
  ],
  controllers: [RegisterServiceController],
  providers: [RegisterServiceService],
})
export class RegisterServiceModule {}
