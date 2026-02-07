import { Module } from '@nestjs/common';
import { PaymentApiModule } from './payment-api/payment-api.module';
import { ProvidersModule } from './providers/providers.module';

@Module({
  imports: [PaymentApiModule, ProvidersModule],
})
export class PaymentModule {}
