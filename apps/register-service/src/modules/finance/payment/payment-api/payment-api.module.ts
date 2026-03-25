import { STUDENT_PACKAGE_NAME } from '@app/grpc/protos/student';
import { USER_PACKAGE_NAME } from '@app/grpc/protos/user';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { FeeModule } from '../../fee/fee.module';
import { PaymentFactory } from '../payment.factory';
import { PaymentModule } from '../payment.module';
import { Payment } from './entities/payment-api.entity';
import { GrpcStudentServiceClient } from './grpc/student-service.client';
import { GrpcUserServiceClient } from './grpc/user-service.client';
import { PaymentApiController } from './payment-api.controller';
import { PaymentApiService } from './payment-api.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    PaymentModule,
    FeeModule,
    ClientsModule.register([
      {
        name: STUDENT_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: STUDENT_PACKAGE_NAME,
          url: `user_service:5003`,
          protoPath: [
            join(process.cwd(), 'libs/grpc/src/protos/student.proto'),
          ],
        },
      },
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          url: `user_service:5003`,
          protoPath: [join(process.cwd(), 'libs/grpc/src/protos/user.proto')],
        },
      },
    ]),
  ],
  controllers: [PaymentApiController],
  providers: [
    PaymentApiService,
    PaymentFactory,
    GrpcStudentServiceClient,
    GrpcUserServiceClient,
  ],
})
export class PaymentApiModule {}
