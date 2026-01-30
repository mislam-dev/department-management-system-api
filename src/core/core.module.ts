import { Module } from '@nestjs/common';
import { AuthModule } from './authentication/auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [AuthModule, SeederModule, ConfigModule, DatabaseModule],
  exports: [AuthModule, SeederModule, ConfigModule, DatabaseModule],
})
export class CoreModule {}
