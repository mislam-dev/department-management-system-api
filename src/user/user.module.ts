import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth0Service } from 'src/auth0/auth0.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotDummyEmailConstraints } from './validators/is-email-not-dummy.validator';
import { UniqueEmailConstraints } from './validators/is-unique-email.validator';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    Auth0Service,
    UniqueEmailConstraints,
    NotDummyEmailConstraints,
  ],
  imports: [TypeOrmModule.forFeature([User])],
  exports: [UserService],
})
export class UserModule {}
