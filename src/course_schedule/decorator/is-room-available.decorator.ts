import { Validate } from 'class-validator';
import { IsRoomAvailableConstraint } from '../validators/is-room-available.validator';

export function IsRoomAvailable() {
  return Validate(IsRoomAvailableConstraint);
}
