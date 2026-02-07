import { Injectable } from '@nestjs/common';
import { CreatePaymentApiDto } from './dto/create-payment-api.dto';
import { UpdatePaymentApiDto } from './dto/update-payment-api.dto';

@Injectable()
export class PaymentApiService {
  create(createPaymentApiDto: CreatePaymentApiDto) {
    console.log(createPaymentApiDto);
    return 'This action adds a new paymentApi';
  }

  findAll() {
    return `This action returns all paymentApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentApi`;
  }

  update(id: number, updatePaymentApiDto: UpdatePaymentApiDto) {
    console.log(updatePaymentApiDto);
    return `This action updates a #${id} paymentApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentApi`;
  }
}
