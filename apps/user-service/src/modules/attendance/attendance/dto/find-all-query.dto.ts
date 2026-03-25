import { PaginationDto } from '@app/common/pagination';
import { IsOptional, IsUUID } from 'class-validator';

export class FindAllQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'Student ID must be a valid UUID' })
  studentId: string;
}
