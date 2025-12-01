import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Teacher } from './entities/teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private readonly repo: Repository<Teacher>,
    private readonly userService: UserService,
  ) {}
  async create(createTeacherDto: CreateTeacherDto) {
    const { designation, email, fullName, joinDate, officeLocation, password } =
      createTeacherDto;
    const user = await this.userService.create({
      password,
      designation,
      email,
      fullName,
    });
    const teacher = this.repo.create({
      userId: user.id,
      joinDate,
      officeLocation,
      designation,
    });
    return this.repo.save(teacher);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const teacher = await this.repo.findOne({ where: { id } });
    if (!teacher) throw new NotFoundException('Teacher data not found');
    return teacher;
  }
  async findOneByUserId(userId: string) {
    const teacher = await this.repo.findOne({ where: { userId } });
    if (!teacher) throw new NotFoundException('Teacher data not found');
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.findOne(id);
    Object.assign(teacher, updateTeacherDto);
    return this.repo.update({ id }, teacher);
  }

  async remove(id: string) {
    const results = await this.repo.delete(id);
    if (!results.affected) throw new NotFoundException('User not found!');
  }
}
