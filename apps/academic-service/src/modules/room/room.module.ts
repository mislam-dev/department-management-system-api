import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { IsRoomNameUniqueConstraint } from './validators/is-room-name-unique.validator';

@Module({
  controllers: [RoomController],
  providers: [RoomService, IsRoomNameUniqueConstraint],
  imports: [TypeOrmModule.forFeature([Room])],
  exports: [RoomService],
})
export class RoomModule {}
