import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { GrpcAuth0ServiceClient } from './grpc/auth0-service.client';
@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly auth0ServiceClient: GrpcAuth0ServiceClient,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, designation, fullName, password } = createUserDto;

    this.logger.log('Creating user in Auth0...');
    const { userId: user_id } = await this.auth0ServiceClient.createUser({
      name: fullName,
      email,
      password,
    });
    this.logger.log('Creating user in Auth0... Done');

    const user = this.repository.create({
      fullName,
      designation,
      email,
      auth0_user_id: user_id,
    });

    this.logger.log('Creating user in database...');
    return await this.repository.save(user);
  }

  async findAll({ limit, offset }: { limit: number; offset: number }) {
    const [results, total] = await this.repository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'desc' },
    });

    return {
      total,
      limit,
      offset,
      results,
    };
  }

  async findOne(id: string) {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async findOneByAuth0Id(id: string) {
    const user = await this.repository.findOne({
      where: { auth0_user_id: id },
    });

    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);

    this.logger.log('Updating user in Auth0...');
    await this.auth0ServiceClient.update({
      auth0UserId: user.auth0_user_id,
      name: user.fullName,
      email: user.email,
    });
    this.logger.log('Updating user in Auth0... Done');

    return this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    this.logger.log('Deleting user in Auth0...');
    await this.auth0ServiceClient.remove(user.auth0_user_id);
    this.logger.log('Deleting user in Auth0... Done');

    const result = await this.repository.delete(id);
    if (!result.affected) throw new NotFoundException('User not found!');
  }
}
