import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { NoticeService } from 'src/notice/notice.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsValidRelatedEntityIDConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly noticeService: NoticeService) {}

  async validate(relatedEntityId: string) {
    if (!relatedEntityId) return false;

    try {
      const exists = await this.noticeService.findOne(relatedEntityId);
      return !!exists;
    } catch {
      return false;
    }
  }

  defaultMessage(): string {
    return 'studentId must be valid!';
  }
}
