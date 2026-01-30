import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherModule } from 'src/modules/identity/teacher/teacher.module';
import { TeacherUnavailability } from './entities/teacher_unavailability.entity';
import { TeacherUnavailabilityController } from './teacher_unavailability.controller';
import { TeacherUnavailabilityService } from './teacher_unavailability.service';
import { ValidTeacherIdConstraints } from './validators/is-valid-teacher-id.validator';

@Module({
  controllers: [TeacherUnavailabilityController],
  providers: [TeacherUnavailabilityService, ValidTeacherIdConstraints],
  imports: [TypeOrmModule.forFeature([TeacherUnavailability]), TeacherModule],
  exports: [TeacherUnavailabilityService],
})
export class TeacherUnavailabilityModule {}
