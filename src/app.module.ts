import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import auth0Config from './config/auth0.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auth0Config],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
