import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeModule } from '../../fee/fee.module';
import { PaymentFactory } from '../payment.factory';
import { PaymentModule } from '../payment.module';
import { Payment } from './entities/payment-api.entity';
import { PaymentApiController } from './payment-api.controller';
import { PaymentApiService } from './payment-api.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), PaymentModule, FeeModule],
  controllers: [PaymentApiController],
  providers: [PaymentApiService, PaymentFactory],
})
export class PaymentApiModule {}
