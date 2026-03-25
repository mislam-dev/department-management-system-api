import { SEMESTER_PACKAGE_NAME } from '@app/grpc/protos/semester';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from '../user/user.module';
import { Student } from './entities/student.entity';
import { GrpcStudentController } from './grpc-student.controller';
import { GrpcSemesterServiceClient } from './grpc/semester-service.client';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { IsValidSemesterIdConstraints } from './validator/is-valid-semester-id.validator';

@Module({
  controllers: [StudentController, GrpcStudentController],
  providers: [
    StudentService,
    IsValidSemesterIdConstraints,
    GrpcSemesterServiceClient,
  ],
  imports: [
    TypeOrmModule.forFeature([Student]),
    UserModule,
    ClientsModule.register([
      {
        name: SEMESTER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: SEMESTER_PACKAGE_NAME,
          url: `academic_service:5001`,
          protoPath: [
            join(process.cwd(), 'libs/grpc/src/protos/semester.proto'),
          ],
        },
      },
    ]),
  ],
  exports: [StudentService],
})
export class StudentModule {}
