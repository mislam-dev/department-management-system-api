import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RoomService } from '../room.service';

@ValidatorConstraint({ name: 'isRoomNameUnique', async: true })
@Injectable()
export class IsRoomNameUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly roomsService: RoomService) {}

  async validate(name: string) {
    try {
      // Logic: If findByName returns null/undefined, it is unique
      await this.roomsService.findOneWhere({ name });
      return false;
    } catch {
      return true;
    }
  }

  defaultMessage() {
    return 'Room name "$value" already exists.';
  }
}
