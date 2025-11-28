import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [TypeOrmModule.forFeature([Activity])],
})
export class ActivityModule {}
