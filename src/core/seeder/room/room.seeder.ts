// src/database/seeds/teacher.seed.ts
import { Injectable, Logger } from '@nestjs/common';
import { RoomService } from 'src/modules/academic/room/room.service';
import { ROOMS } from './room.data';

@Injectable()
export class RoomSeeder {
  private readonly logger = new Logger(RoomSeeder.name);

  constructor(private readonly roomService: RoomService) {}

  async seed() {
    this.logger.log('Started seeding teachers...');

    for (const dto of ROOMS) {
      try {
        await this.roomService.findOneWhere({ name: dto.name });
        this.logger.debug(`Skipping ${dto.name} (already exists)`);
      } catch {
        await this.roomService.create(dto);
        this.logger.log(`Created room: ${dto.name}`);
      }
    }

    this.logger.log('Room seeding completed.');
  }
}
