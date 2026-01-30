import { Validate } from 'class-validator';
import { IsValidRelatedEntityIDConstraint } from '../validators/is-valid-related-entiy-id.validator';

export function IsValidRelatedEntityID() {
  return Validate(IsValidRelatedEntityIDConstraint);
}
