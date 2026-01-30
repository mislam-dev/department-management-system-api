import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semester } from './entities/semester.entity';
import { SemesterController } from './semester.controller';
import { SemesterService } from './semester.service';
import { IsValidSemesterIdConstraints } from './validator/is-valid-semester-id.validator';

@Module({
  controllers: [SemesterController],
  providers: [SemesterService, IsValidSemesterIdConstraints],
  imports: [TypeOrmModule.forFeature([Semester])],
  exports: [SemesterService, IsValidSemesterIdConstraints],
})
export class SemesterModule {}
