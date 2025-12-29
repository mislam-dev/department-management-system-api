// src/database/seeds/teacher.data.ts
import { Designation } from 'src/user/entities/user.entity';
import { CreateTeacherDto } from '../../teacher/dto/create-teacher.dto';
// Adjust the import path to where your Designation constant is defined

const STRONG_PASSWORD = 'P@ssw0rd2025!';

export const TEACHERS_SEED_DATA: CreateTeacherDto[] = [
  // --- Computer Department Leads ---
  {
    email: 'head.computer@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Engr. Rahim Uddin',
    designation: Designation.DEPARTMENT_HEAD,
    joinDate: '2010-01-15',
    officeLocation: 'Room 300, Academic Building 1',
  },
  {
    email: 'chief.computer@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Saiful Islam',
    designation: Designation.CHIEF_INSTRUCTOR,
    joinDate: '2012-03-20',
    officeLocation: 'Room 301, Academic Building 1',
  },

  // --- Computer Instructors ---
  {
    email: 'tania.net@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Tania Rahman',
    designation: Designation.INSTRUCTOR,
    joinDate: '2015-07-10',
    officeLocation: 'Server Room, Admin Building',
  },
  {
    email: 'arif.python@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Arif Ahmed',
    designation: Designation.JUNIOR_INSTRUCTOR,
    joinDate: '2021-05-12',
    officeLocation: 'Lab 3, Computer Center',
  },
  {
    email: 'karim.web@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Karim Hasan',
    designation: Designation.JUNIOR_INSTRUCTOR,
    joinDate: '2023-01-10',
    officeLocation: 'Lab 2, Computer Center',
  },

  // --- Non-Tech (Math & Science) ---
  {
    email: 'nasreen.math@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Nasreen Akter',
    designation: Designation.INSTRUCTOR,
    joinDate: '2016-06-01',
    officeLocation: 'Room 205, Science Building',
  },
  {
    email: 'subrata.physics@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Dr. Subrata Das',
    designation: Designation.INSTRUCTOR,
    joinDate: '2017-11-05',
    officeLocation: 'Room 206, Science Building',
  },
  {
    email: 'fariha.chem@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Fariha Jannat',
    designation: Designation.JUNIOR_INSTRUCTOR,
    joinDate: '2021-08-15',
    officeLocation: 'Chemistry Lab, Science Building',
  },

  // --- Workshop & Electrical (Craft Instructors) ---
  // Using 'CRAFT_INSTRUCTOR' for practical-heavy trades like Electronics/Electricity
  {
    email: 'malik.electronics@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Abdul Malik',
    designation: Designation.CRAFT_INSTRUCTOR,
    joinDate: '2014-04-22',
    officeLocation: 'Room 101, Workshop Building',
  },
  {
    email: 'biplob.electrical@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Biplob Kumar',
    designation: Designation.CRAFT_INSTRUCTOR,
    joinDate: '2019-09-30',
    officeLocation: 'Room 102, Workshop Building',
  },

  // --- Humanities (English, Bangla, Management) ---
  {
    email: 'farhana.english@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Farhana Khan',
    designation: Designation.INSTRUCTOR,
    joinDate: '2018-01-15',
    officeLocation: 'Room 401, Humanities Building',
  },
  {
    email: 'momena.bangla@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Momena Begum',
    designation: Designation.INSTRUCTOR,
    joinDate: '2016-02-28',
    officeLocation: 'Room 402, Humanities Building',
  },
  {
    email: 'jamal.acc@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Jamal Hossain',
    designation: Designation.INSTRUCTOR,
    joinDate: '2018-12-01',
    officeLocation: 'Room 405, Business Faculty',
  },
  {
    email: 'salma.mkt@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Salma Yeasmin',
    designation: Designation.JUNIOR_INSTRUCTOR,
    joinDate: '2022-03-10',
    officeLocation: 'Room 406, Business Faculty',
  },

  // --- Support Staff ---
  {
    email: 'rashed.sports@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Rashed Mamun',
    designation: Designation.INSTRUCTOR, // Physical Education Instructor
    joinDate: '2021-01-01',
    officeLocation: 'Gymnasium Office',
  },
  {
    email: 'operator.lab1@polytechnic.edu',
    password: STRONG_PASSWORD,
    fullName: 'Kamal Hossain',
    designation: Designation.COMPUTER_OPERATOR,
    joinDate: '2020-05-15',
    officeLocation: 'Computer Lab 1',
  },
];
