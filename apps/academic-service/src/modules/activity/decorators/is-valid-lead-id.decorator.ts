import { Validate } from 'class-validator';
import { IsValidLeadIDConstraint } from '../validators/is-valid-lead-id.validator';

export function IsValidLeadID() {
  return Validate(IsValidLeadIDConstraint);
}
