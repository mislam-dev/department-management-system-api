import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [StudentModule, TeacherModule, UserModule],
  exports: [StudentModule, TeacherModule, UserModule],
})
export class IdentityModule {}
