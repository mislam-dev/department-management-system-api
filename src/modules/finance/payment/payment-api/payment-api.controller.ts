import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { SetPermissions } from 'src/core/authentication/auth/decorators/set-permissions.decorator';
import { CreatePaymentApiDto } from './dto/create-payment-api.dto';
import { UpdatePaymentApiDto } from './dto/update-payment-api.dto';
import { PaymentApiService } from './payment-api.service';

@Controller('payment-api')
export class PaymentApiController {
  constructor(private readonly paymentApiService: PaymentApiService) {}

  @Post()
  create(@Body() createPaymentApiDto: CreatePaymentApiDto) {
    return this.paymentApiService.create(createPaymentApiDto);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('feesId') feesId?: string,
  ) {
    const { results, total } = await this.paymentApiService.findAll(
      paginationDto,
      feesId,
    );
    return {
      results,
      total,
      limit: paginationDto.limit || 10,
      offset: paginationDto.offset || 0,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentApiDto: UpdatePaymentApiDto,
  ) {
    return this.paymentApiService.update(id, updatePaymentApiDto);
  }

  @SetPermissions('payment:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentApiService.remove(id);
  }
}
