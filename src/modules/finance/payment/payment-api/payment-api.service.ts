import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentApiDto } from './dto/create-payment-api.dto';
import { UpdatePaymentApiDto } from './dto/update-payment-api.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { StudentService } from 'src/modules/identity/student/student.service';
import { UserService } from 'src/modules/identity/user/user.service';
import { Repository } from 'typeorm';
import { FeeService } from '../../fee/fee.service';
import { PaymentFactory } from '../payment.factory';
import { Payment, PaymentStatus } from './entities/payment-api.entity';

@Injectable()
export class PaymentApiService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly paymentFactory: PaymentFactory,
    private readonly feeService: FeeService,
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}

  async create(createPaymentApiDto: CreatePaymentApiDto) {
    const { provider, feesId } = createPaymentApiDto;
    const fee = await this.feeService.findOne(feesId);
    if (!fee) {
      throw new NotFoundException(`Fee with ID "${feesId}" not found`);
    }
    const student = await this.studentService.findOne(fee.studentId);
    if (!student) {
      throw new NotFoundException(
        `Student with ID "${fee.studentId}" not found`,
      );
    }
    const user = await this.userService.findOne(student.userId);
    if (!user) {
      throw new NotFoundException(`User with ID "${student.userId}" not found`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const strategy = this.paymentFactory.getStrategy(provider as any);
    const p = await strategy.init({
      total_amount: fee.sub_total,
      currency: 'BDT',
      cus_name: user.fullName,
      cus_email: user.email,
      cus_add1: 'NA',
      cus_phone: 'NA',
    });
    const payment = this.paymentRepository.create({
      provider,
      feesId,
      status: PaymentStatus.PENDING,
    });
    const paymentSaved = await this.paymentRepository.save(payment);
    return {
      url: p.url,
      tran_id: p.tran_id,
      payment: paymentSaved,
    };
  }

  async findAll(paginationDto: PaginationDto, feesId?: string) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [results, total] = await this.paymentRepository.findAndCount({
      where: {
        feesId: feesId ? feesId : undefined,
      },
      take: limit,
      skip: offset,
      order: {
        createdAt: 'DESC',
      },
    });
    return { results, total };
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
    return payment;
  }

  async update(
    id: string,
    updatePaymentApiDto: UpdatePaymentApiDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentApiDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID "${id}" not found`);
    }
  }
}
