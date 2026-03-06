import { Module } from '@nestjs/common';
import { FeeModule } from './fee/fee.module';
import { PaymentApiModule } from './payment/payment-api/payment-api.module';

@Module({
  imports: [FeeModule, PaymentApiModule],
})
export class FinanceModule {}
