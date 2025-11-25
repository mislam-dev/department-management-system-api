import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Teacher } from './entities/teacher.entity';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { UniqueUserConstraints } from './validators/is-unique-user-id.validator';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, UniqueUserConstraints],
  imports: [TypeOrmModule.forFeature([Teacher]), UserModule],
})
export class TeacherModule {}
