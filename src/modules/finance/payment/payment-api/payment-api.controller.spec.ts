import { Test, TestingModule } from '@nestjs/testing';
import { PaymentApiController } from './payment-api.controller';
import { PaymentApiService } from './payment-api.service';

describe('PaymentApiController', () => {
  let controller: PaymentApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentApiController],
      providers: [PaymentApiService],
    }).compile();

    controller = module.get<PaymentApiController>(PaymentApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
