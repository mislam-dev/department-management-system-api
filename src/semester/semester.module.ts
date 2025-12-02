import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';

@Module({
  controllers: [SemesterController],
  providers: [SemesterService],
  imports: [TypeOrmModule.forFeature([Semester])],
  exports: [SemesterService],
})
export class SemesterModule {}
