import { PaginationDto } from '@app/common/pagination';

export class FindAllQueryDto extends PaginationDto {
  declare limit: number;
}
