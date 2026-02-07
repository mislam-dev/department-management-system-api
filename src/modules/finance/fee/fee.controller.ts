import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from '../../../common/pagination/pagination.dto';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { FeeService } from './fee.service';

@Controller('fee')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Post()
  create(@Body() createFeeDto: CreateFeeDto) {
    return this.feeService.create(createFeeDto);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('studentId') studentId?: string,
    @Query('semesterId') semesterId?: string,
  ) {
    const { results, total } = await this.feeService.findAll(
      paginationDto,
      studentId,
      semesterId,
    );
    return {
      results,
      total,
      limit: paginationDto.limit || 10,
      offset: paginationDto.offset || 0,
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.feeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFeeDto: UpdateFeeDto,
  ) {
    return this.feeService.update(id, updateFeeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.feeService.remove(id);
  }
}
