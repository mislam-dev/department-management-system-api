import { Module } from '@nestjs/common';
import { BkashModule } from './bkash/bkash.module';
import { SslcomerzModule } from './sslcomerz/sslcomerz.module';
import { StrapiModule } from './strapi/strapi.module';

@Module({
  imports: [
    BkashModule,
    SslcomerzModule.register({
      store_id: 'monir698866676baa6',
      store_password: 'monir698866676baa6@ssl',
      store_type: 'test',
      is_live: false,
      success_url: 'http://localhost:3000/success',
      failure_url: 'http://localhost:3000/failure',
      cancel_url: 'http://localhost:3000/cancel',
      ipn_url: 'http://localhost:3000/ipn',
    }),
    StrapiModule,
  ],
})
export class ProvidersModule {}
