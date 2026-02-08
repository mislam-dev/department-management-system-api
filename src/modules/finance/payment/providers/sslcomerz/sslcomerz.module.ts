import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import SSLCommerzPayment from 'sslcommerz-lts';
import {
  SSLCOMMERZ_CANCEL_URL,
  SSLCOMMERZ_FAIL_URL,
  SSLCOMMERZ_INSTANCE,
  SSLCOMMERZ_IPN_URL,
  SSLCOMMERZ_SUCCESS_URL,
} from './sllcomerz.constant';
import { SslcomerzStrategy } from './sslcomerz.strategy';
import { SslcommerzConfig } from './types/config.types';

@Global()
@Module({})
export class SslcomerzModule {
  static register(config: SslcommerzConfig): DynamicModule {
    const { is_live, store_id, store_password } = config;
    const sslcz = new SSLCommerzPayment(store_id, store_password, is_live);
    const provider: Provider = {
      provide: SSLCOMMERZ_INSTANCE,
      useValue: sslcz,
    };
    const sslConfigValue: Provider[] = [
      {
        provide: SSLCOMMERZ_SUCCESS_URL,
        useValue: config.success_url,
      },
      {
        provide: SSLCOMMERZ_FAIL_URL,
        useValue: config.failure_url,
      },
      {
        provide: SSLCOMMERZ_CANCEL_URL,
        useValue: config.cancel_url,
      },
      {
        provide: SSLCOMMERZ_IPN_URL,
        useValue: config.ipn_url,
      },
    ];
    return {
      module: SslcomerzModule,
      providers: [
        provider,
        ...sslConfigValue,
        {
          provide: SslcomerzStrategy,
          useClass: SslcomerzStrategy,
        },
      ],
      exports: [
        provider,
        ...sslConfigValue,
        {
          provide: SslcomerzStrategy,
          useClass: SslcomerzStrategy,
        },
      ],
    };
  }
}
