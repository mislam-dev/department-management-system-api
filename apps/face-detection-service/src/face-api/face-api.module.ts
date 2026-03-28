import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaceApiController } from './face-api.controller';
import { FaceApiService } from './face-api.service';
import { FaceApiEntity } from './entities/face-api.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaceApiEntity])],
  controllers: [FaceApiController],
  providers: [FaceApiService],
})
export class FaceApiModule {}
