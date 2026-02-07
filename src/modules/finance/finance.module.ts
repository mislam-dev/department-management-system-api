import { Module } from '@nestjs/common';
import { FeeModule } from './fee/fee.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [FeeModule, PaymentModule],
})
export class FinanceModule {}
