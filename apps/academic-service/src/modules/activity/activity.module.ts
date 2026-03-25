import { USER_PACKAGE_NAME } from '@app/grpc/protos/user';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { NoticeModule } from '../notice/notice.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { UserServiceClient } from './grpc/user-service.client';
import { IsValidLeadIDConstraint } from './validators/is-valid-lead-id.validator';
import { IsValidRelatedEntityIDConstraint } from './validators/is-valid-related-entiy-id.validator';

@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    IsValidLeadIDConstraint,
    IsValidRelatedEntityIDConstraint,
    UserServiceClient,
  ],
  imports: [
    TypeOrmModule.forFeature([Activity]),
    NoticeModule,
    ClientsModule.register([
      {
        name: USER_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          url: `user_service:5003`,
          protoPath: join(process.cwd(), 'libs/grpc/src/protos/user.proto'),
        },
      },
    ]),
  ],
})
export class ActivityModule {}
