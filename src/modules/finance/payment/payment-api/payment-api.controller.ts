/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  type RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { Public } from 'src/core/authentication/auth/decorators/public.decorator';
import { SetPermissions } from 'src/core/authentication/auth/decorators/set-permissions.decorator';
import { CreatePaymentApiDto } from './dto/create-payment-api.dto';
import { SslcommerzCallbackDto } from './dto/sslcommerz-callback.dto';
import { UpdatePaymentApiDto } from './dto/update-payment-api.dto';
import { PaymentApiService } from './payment-api.service';

@Controller('payment')
export class PaymentApiController {
  constructor(private readonly paymentApiService: PaymentApiService) {}

  @Post()
  create(@Body() createPaymentApiDto: CreatePaymentApiDto) {
    return this.paymentApiService.create(createPaymentApiDto);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('feesId') feesId?: string,
  ) {
    const { results, total } = await this.paymentApiService.findAll(
      paginationDto,
      feesId,
    );
    return {
      results,
      total,
      limit: paginationDto.limit || 10,
      offset: paginationDto.offset || 0,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentApiDto: UpdatePaymentApiDto,
  ) {
    return this.paymentApiService.update(id, updatePaymentApiDto);
  }

  @SetPermissions('payment:delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentApiService.remove(id);
  }

  // payment callbacks
  @Public()
  @Post('callback/sslcommerz/success')
  async sslSuccess(@Req() req: Request, @Res() res: Response) {
    const body = req.body as unknown as SslcommerzCallbackDto;
    const { url } = await this.paymentApiService.handleCallback(
      'sslcommerz',
      body,
    );
    res.redirect(url);
  }
  @Public()
  @Post('callback/sslcommerz/failure')
  async sslFail(@Req() req: Request, @Res() res: Response) {
    const body = req.body as SslcommerzCallbackDto;
    const { url } = await this.paymentApiService.handleCallback(
      'sslcommerz',
      body,
    );
    res.redirect(url);
  }
  @Public()
  @Post('callback/stripe/webhook')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>, // Custom type for rawBody
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }

    await this.paymentApiService.handleCallback('stripe', {
      rawBody: req.rawBody as any,
      signature,
    });
    return { received: true };
  }
}
