import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/pagination/pagination.dto';

export class FindAllQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID(undefined, { message: 'Student ID must be a valid UUID' })
  studentId: string;
}
