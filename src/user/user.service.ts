import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth0Service } from 'src/auth0/auth0.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly auth0: Auth0Service,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { email, designation, fullName, password } = createUserDto;
    const { user_id } = await this.auth0.createUser({
      name: fullName,
      password,
      email,
    });

    const user = this.repository.create({
      fullName,
      designation,
      email,
      auth0_user_id: user_id,
    });
    return await this.repository.save(user);
  }

  findAll() {
    return this.repository.find();
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

    await this.auth0.updateUser(user.auth0_user_id, {
      email: user.email,
      name: user.fullName,
    });
    return this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.auth0.deleteUser(user.auth0_user_id);
    const result = await this.repository.delete(id);
    if (!result.affected) throw new NotFoundException('User not found!');
  }
}
