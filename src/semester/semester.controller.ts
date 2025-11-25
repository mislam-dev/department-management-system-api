import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { SetRolePermissions } from 'src/auth/decorators/set-roles-permissions.decorator';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { SemesterService } from './semester.service';

@Controller('semester')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @SetRolePermissions(['admin'], ['semester:create'])
  @Post()
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semesterService.create(createSemesterDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.semesterService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.semesterService.findOne(id);
  }

  @SetRolePermissions(['admin'], ['semester:update'])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSemesterDto: UpdateSemesterDto,
  ) {
    return this.semesterService.update(id, updateSemesterDto);
  }

  @SetRolePermissions(['admin'], ['semester:delete'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.semesterService.remove(id);
  }
}
