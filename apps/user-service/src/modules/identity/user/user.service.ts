import { AUTH0_SERVICE_NAME, Auth0ServiceClient } from '@app/grpc/auth/auth0';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PACKAGE_NAME } from './grpc/constants';
@Injectable()
export class UserService implements OnModuleInit {
  private logger = new Logger(UserService.name);
  private auth0Service: Auth0ServiceClient;
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    @Inject(PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}
  onModuleInit() {
    this.auth0Service =
      this.client.getService<Auth0ServiceClient>(AUTH0_SERVICE_NAME);
  }
  async create(createUserDto: CreateUserDto) {
    const { email, designation, fullName, password } = createUserDto;
    this.logger.debug('Creating user ', createUserDto);
    const { userId: user_id } = await lastValueFrom(
      this.auth0Service.createUser({
        name: fullName,
        password,
        email,
      }),
    );

    const user = this.repository.create({
      fullName,
      designation,
      email,
      auth0_user_id: user_id,
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

    await lastValueFrom(
      this.auth0Service.updateUser({
        auth0UserId: user.auth0_user_id,
        name: user.fullName,
        email: user.email,
      }),
    );
    return this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await lastValueFrom(
      this.auth0Service.deleteUser({ userId: user.auth0_user_id }),
    );
    const result = await this.repository.delete(id);
    if (!result.affected) throw new NotFoundException('User not found!');
  }
}
