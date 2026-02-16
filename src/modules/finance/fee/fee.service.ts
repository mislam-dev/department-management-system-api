import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationDto } from '../../../common/pagination/pagination.dto';
import { CreateFeeDto } from './dto/create-fee.dto';
import { UpdateFeeDto } from './dto/update-fee.dto';
import { Fee } from './entities/fee.entity';

@Injectable()
export class FeeService {
  constructor(
    @InjectRepository(Fee)
    private readonly feeRepository: Repository<Fee>,
  ) {}

  create(createFeeDto: CreateFeeDto): Promise<Fee> {
    const fee = this.feeRepository.create(createFeeDto);
    return this.feeRepository.save(fee);
  }

  async findAll(
    paginationDto: PaginationDto,
    studentId?: string,
    semesterId?: string,
  ): Promise<{ results: Fee[]; total: number }> {
    const where: FindOptionsWhere<Fee> = {};
    if (studentId) where.studentId = studentId;
    if (semesterId) where.semesterId = semesterId;

    const { limit = 10, offset = 0 } = paginationDto;

    const [results, total] = await this.feeRepository.findAndCount({
      where,
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return { results, total };
  }

  async findOne(id: string): Promise<Fee> {
    const fee = await this.feeRepository.findOne({ where: { id } });
    if (!fee) {
      throw new NotFoundException(`Fee with ID "${id}" not found`);
    }
    return fee;
  }

  async update(id: string, updateFeeDto: UpdateFeeDto): Promise<Fee> {
    const fee = await this.findOne(id);
    Object.assign(fee, updateFeeDto);
    return this.feeRepository.save(fee);
  }

  async remove(id: string): Promise<void> {
    const result = await this.feeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fee with ID "${id}" not found`);
    }
  }
}
