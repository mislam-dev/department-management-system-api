declare module 'sslcommerz-lts' {
  interface InitResponse {
    status: 'SUCCESS' | 'FAILED';
    failedreason: string;
    sessionkey: string;
    gw: {
      visa: string;
      master: string;
      amex: string;
      othercards: string;
      internetbanking: string;
      mobilebanking: string;
    };
    redirectGatewayURL: string;
    directPaymentURLBank: string;
    directPaymentURLCard: string;
    directPaymentURL: string;
    redirectGatewayURLFailed: string;
    GatewayPageURL: string;
    storeBanner: string;
    storeLogo: string;
    store_name: string;
    desc: {
      name: string;
      type: string;
      logo: string;
      gw: string;
      r_flag: string;
      redirectGatewayURL: string;
    }[];
    is_direct_pay_enable: string;
  }
  export default class SSLCommerzPayment {
    constructor(store_id: string, store_password: string, live?: boolean);
    init(
      data: import('src/modules/finance/payment/providers/sslcomerz/types/methods.type').InitData,
      url?: string | false,
      method?: string,
    ): Promise<InitResponse>;
    validate(data: any, url?: string | false, method?: string): Promise<any>;
    initiateRefund(
      data: any,
      url?: string | false,
      method?: string,
    ): Promise<any>;
    refundQuery(data: any, url?: string | false, method?: string): Promise<any>;
    transactionQueryBySessionId(
      data: any,
      url?: string | false,
      method?: string,
    ): Promise<any>;
    transactionQueryByTransactionId(
      data: any,
      url?: string | false,
      method?: string,
    ): Promise<any>;
  }
}
