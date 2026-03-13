import { SetPermissions } from '@app/common/auth/decorators/set-permissions.decorator';
import { CacheTTL } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { SemesterService } from './semester.service';

@Controller('semester')
@CacheTTL(1000 * 60 * 60 * 24 * 30 * 6) // 6 months
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @SetPermissions('semester:create') // todo use only permissions
  @Post()
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  // @Public()
  @Get()
  findAll() {
    console.log('find all');
    return this.semesterService.findAll();
  }

  // @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semesterService.findOne(id);
  }

  @SetPermissions('semester:update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semesterService.update(id, updateSemesterDto);
  }

  @SetPermissions('semester:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semesterService.remove(id);
  }
}
