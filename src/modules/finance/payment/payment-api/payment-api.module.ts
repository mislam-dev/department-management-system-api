import { Module } from '@nestjs/common';
import { PaymentApiService } from './payment-api.service';
import { PaymentApiController } from './payment-api.controller';

@Module({
  controllers: [PaymentApiController],
  providers: [PaymentApiService],
})
export class PaymentApiModule {}
