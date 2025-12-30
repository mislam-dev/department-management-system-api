import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }

  findAll(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  async findOneWhere(where: FindOptionsWhere<Room>): Promise<Room> {
    const room = await this.roomRepository.findOne({ where });
    if (!room) {
      throw new NotFoundException(`Room not found`);
    }
    return room;
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID "${id}" not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);
    Object.assign(room, updateRoomDto);
    return this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const result = await this.roomRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Room with ID "${id}" not found`);
    }
  }
}
