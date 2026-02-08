import { Inject, Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import SSLCommerzPayment from 'sslcommerz-lts';
import { PaymentStrategy } from '../../interfaces/payment-strategy/payment-strategy.interface';
import {
  SSLCOMMERZ_CANCEL_URL,
  SSLCOMMERZ_FAIL_URL,
  SSLCOMMERZ_INSTANCE,
  SSLCOMMERZ_IPN_URL,
  SSLCOMMERZ_SUCCESS_URL,
} from './sllcomerz.constant';
import { InitData, InitDataRequest } from './types/methods.type';

@Injectable()
export class SslcomerzStrategy implements PaymentStrategy {
  constructor(
    @Inject(SSLCOMMERZ_INSTANCE)
    private readonly sslcommerz: SSLCommerzPayment,
    @Inject(SSLCOMMERZ_SUCCESS_URL)
    private readonly successUrl: string,
    @Inject(SSLCOMMERZ_FAIL_URL)
    private readonly failUrl: string,
    @Inject(SSLCOMMERZ_CANCEL_URL)
    private readonly cancelUrl: string,
    @Inject(SSLCOMMERZ_IPN_URL)
    private readonly ipnUrl: string,
  ) {}
  private generateTranId(): string {
    const nanoid = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 15);
    const tran_id = `ORDER_${nanoid()}`;
    return tran_id;
  }
  async init(data: InitDataRequest): Promise<{ url: string; tran_id: string }> {
    const data2: InitData = {
      ...data,
      tran_id: this.generateTranId(),
      success_url: this.successUrl,
      fail_url: this.failUrl,
      cancel_url: this.cancelUrl,
      ipn_url: this.ipnUrl,
      shipping_method: 'NO',
    };
    const apiResponse = await this.sslcommerz.init(data2);
    if (apiResponse.status === 'FAILED') {
      throw new Error(apiResponse.failedreason);
    }
    const url: string = apiResponse.GatewayPageURL;
    return { url, tran_id: data2.tran_id };
  }
  checkout(amount: number): Promise<string> {
    console.log(amount);
    throw new Error('Method not implemented.');
  }
  async validate(data: { val_id: string }): Promise<unknown> {
    const apiResponse: unknown = await this.sslcommerz.validate(data);
    return apiResponse;
  }
}
