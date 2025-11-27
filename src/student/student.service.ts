import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student) private readonly repo: Repository<Student>,
    private readonly userService: UserService,
  ) {}
  async create(createStudentDto: CreateStudentDto) {
    const {
      email,
      fullName,
      password,
      currentSemesterId,
      enrolmentDate,
      graduationYear,
      session,
      status,
    } = createStudentDto;
    const user = await this.userService.create({
      password,
      designation: 'student',
      email,
      fullName,
    });
    const student = this.repo.create({
      currentSemesterId,
      enrolmentDate,
      graduationYear,
      session,
      status,
      userId: user.id,
    });
    return this.repo.save(student);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const student = await this.repo.findOne({ where: { id } });
    if (!student) throw new NotFoundException('Student not found!');
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    const student = await this.findOne(id);

    Object.assign(student, updateStudentDto);

    return this.repo.save(student);
  }

  async remove(id: string) {
    const result = await this.repo.delete({ id });
    if (!result.affected) throw new NotFoundException('User not found!');
  }
}
