import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeModule } from 'src/notice/notice.module';
import { UserModule } from 'src/user/user.module';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { IsValidLeadIDConstraint } from './validators/is-valid-lead-id.validator';
import { IsValidRelatedEntityIDConstraint } from './validators/is-valid-related-entiy-id.validator';

@Module({
  controllers: [ActivityController],
  providers: [
    ActivityService,
    IsValidLeadIDConstraint,
    IsValidRelatedEntityIDConstraint,
  ],
  imports: [TypeOrmModule.forFeature([Activity]), NoticeModule, UserModule],
})
export class ActivityModule {}
