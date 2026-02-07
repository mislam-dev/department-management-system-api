import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fee } from './entities/fee.entity';
import { FeeController } from './fee.controller';
import { FeeService } from './fee.service';

@Module({
  imports: [TypeOrmModule.forFeature([Fee])],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
