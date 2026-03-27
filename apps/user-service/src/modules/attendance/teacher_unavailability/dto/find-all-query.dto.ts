import { PaginationDto } from '@app/common/pagination';
import { IntersectionType } from '@nestjs/swagger';
import { ResourceParamDto } from './resource-query.dto';

export class FindAllQueryDTO extends IntersectionType(
  PaginationDto,
  ResourceParamDto,
) {}
