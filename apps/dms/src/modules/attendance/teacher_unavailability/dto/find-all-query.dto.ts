import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../../../common/pagination/pagination.dto';
import { ResourceParamDto } from './resource-query.dto';

export class FindAllQueryDTO extends IntersectionType(
  PaginationDto,
  ResourceParamDto,
) {}
