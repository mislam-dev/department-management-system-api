import { protobufPackage } from '@app/grpc/auth/auth0';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './entities/user.entity';
import { PACKAGE_NAME } from './grpc/constants';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotDummyEmailConstraints } from './validators/is-email-not-dummy.validator';
import { UniqueEmailConstraints } from './validators/is-unique-email.validator';

@Module({
  controllers: [UserController],
  providers: [UserService, UniqueEmailConstraints, NotDummyEmailConstraints],
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.register([
      {
        name: PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: protobufPackage,
          protoPath: join(process.cwd(), 'libs/grpc/src/auth/auth0.proto'),
          url: 'localhost:5002',
        },
      },
    ]),
  ],
  exports: [UserService],
})
export class UserModule {}
