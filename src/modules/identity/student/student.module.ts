import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SemesterModule } from 'src/modules/academic/semester/semester.module';
import { UserModule } from 'src/modules/identity/user/user.module';
import { Student } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { IsValidSemesterIdConstraints } from './validator/is-valid-semester-id.validator';

@Module({
  controllers: [StudentController],
  providers: [StudentService, IsValidSemesterIdConstraints],
  imports: [TypeOrmModule.forFeature([Student]), UserModule, SemesterModule],
  exports: [StudentService],
})
export class StudentModule {}
