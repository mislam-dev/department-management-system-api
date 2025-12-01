import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Student } from './entities/student.entity';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  imports: [TypeOrmModule.forFeature([Student]), UserModule],
  exports: [StudentService],
})
export class StudentModule {}
