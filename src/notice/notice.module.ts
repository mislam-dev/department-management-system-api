import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

@Module({
  controllers: [NoticeController],
  providers: [NoticeService],
  imports: [TypeOrmModule.forFeature([Notice])],
})
export class NoticeModule {}
