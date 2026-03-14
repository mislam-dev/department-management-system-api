import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './core/config/config.module';
import { MessengerController } from './messenger.controller';
import { MessengerService } from './messenger.service';
import { ChatModule } from './modules/chat/chat.module';
import { GatewayModule } from './modules/gateway/gateway.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.getOrThrow<string>('database.host'),
          port: config.getOrThrow<number>('database.port'),
          username: config.getOrThrow<string>('database.username'),
          password: config.getOrThrow<string>('database.password'),
          database: config.getOrThrow<string>('database.name'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          connection: {
            host: config.get<string>('bull.host'),
            port: config.get<number>('bull.port'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ChatModule,
    GatewayModule,
  ],
  controllers: [MessengerController],
  providers: [MessengerService],
})
export class MessengerModule {}
