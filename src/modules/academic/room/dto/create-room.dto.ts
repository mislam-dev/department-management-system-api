import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsRoomNameUnique } from '../decorators/is-room-name-unique.decorator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @IsRoomNameUnique()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(RoomType, {
    message: 'type must be one of: office, classroom, lab, washroom',
  })
  type: RoomType;

  @IsInt()
  @IsOptional()
  capacity: number;
}
