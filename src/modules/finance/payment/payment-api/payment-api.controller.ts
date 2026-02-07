import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentApiService } from './payment-api.service';
import { CreatePaymentApiDto } from './dto/create-payment-api.dto';
import { UpdatePaymentApiDto } from './dto/update-payment-api.dto';

@Controller('payment-api')
export class PaymentApiController {
  constructor(private readonly paymentApiService: PaymentApiService) {}

  @Post()
  create(@Body() createPaymentApiDto: CreatePaymentApiDto) {
    return this.paymentApiService.create(createPaymentApiDto);
  }

  @Get()
  findAll() {
    return this.paymentApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentApiService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentApiDto: UpdatePaymentApiDto,
  ) {
    return this.paymentApiService.update(+id, updatePaymentApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentApiService.remove(+id);
  }
}
