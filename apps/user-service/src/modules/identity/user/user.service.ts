import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, designation, fullName } = createUserDto;
    // todo create user via auth_service
    // const { user_id } = await this.auth0.createUser({
    //   name: fullName,
    //   password,
    //   email,
    // });

    const user = this.repository.create({
      fullName,
      designation,
      email,
      auth0_user_id: 'user_id',
    });
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

    // await this.auth0.updateUser(user.auth0_user_id, {
    //   email: user.email,
    //   name: user.fullName,
    // });
    // todo update user via auth_service
    return this.repository.save(user);
  }

  async remove(id: string) {
    // const user = await this.findOne(id);
    // await this.auth0.deleteUser(user.auth0_user_id);
    // todo update user via auth_service
    const result = await this.repository.delete(id);
    if (!result.affected) throw new NotFoundException('User not found!');
  }
}
