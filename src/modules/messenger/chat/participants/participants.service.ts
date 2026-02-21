import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private readonly participantRepo: Repository<Participant>,
  ) {}
  create(createParticipantDto: CreateParticipantDto) {
    const participant = this.participantRepo.create(createParticipantDto);
    return this.participantRepo.save(participant);
  }
  createMany(createParticipantDto: CreateParticipantDto[]) {
    const participants = createParticipantDto.map((item) => {
      return this.participantRepo.create(item);
    });
    return this.participantRepo.save(participants);
  }

  findAll(conversationId: string) {
    return this.participantRepo.find({ where: { conversationId } });
  }

  async findOne(id: string): Promise<Participant> {
    const participant = await this.participantRepo.findOne({ where: { id } });
    if (!participant) {
      throw new NotFoundException('Participant not found');
    }
    return participant;
  }
  async findOneBy(
    where: FindOptionsWhere<Participant>,
  ): Promise<Participant | null> {
    return this.participantRepo.findOne({ where });
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    const participant = await this.findOne(id);
    Object.assign(participant, updateParticipantDto);
    return this.participantRepo.save(participant);
  }

  async remove(id: string) {
    const result = await this.participantRepo.delete(id);
    if (!result.affected) {
      throw new NotFoundException('Participant not found');
    }
  }
}
