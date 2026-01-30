import { RoomType } from 'src/modules/academic/room/entities/room.entity';

export const ROOMS = [
  // --- 2nd Floor ---
  {
    name: 'Room 208',
    location: '2nd Floor',
    type: RoomType.CLASSROOM,
    capacity: 40,
  },
  {
    name: 'Software Lab',
    location: '2nd Floor',
    type: RoomType.LAB,
    capacity: 30,
  },
  {
    name: 'Network Lab',
    location: '2nd Floor',
    type: RoomType.LAB,
    capacity: 25,
  },
  {
    name: 'Hardware Lab',
    location: '2nd Floor',
    type: RoomType.LAB,
    capacity: 25,
  },
  { name: 'IoT Lab', location: '2nd Floor', type: RoomType.LAB, capacity: 20 },
  {
    name: 'Digital Lab',
    location: '2nd Floor',
    type: RoomType.LAB,
    capacity: 25,
  },
  {
    name: 'Department Head 2nd Shift (Office)',
    location: '2nd Floor',
    type: RoomType.OFFICE,
    capacity: 5,
  },
  {
    name: "Teacher's Common Room",
    location: '2nd Floor',
    type: RoomType.OFFICE,
    capacity: 15,
  },

  // --- 3rd Floor ---
  {
    name: 'COM-302',
    location: '3rd Floor',
    type: RoomType.CLASSROOM,
    capacity: 50,
  },
  {
    name: 'COM-303',
    location: '3rd Floor',
    type: RoomType.CLASSROOM,
    capacity: 50,
  },
  {
    name: 'COM-304',
    location: '3rd Floor',
    type: RoomType.CLASSROOM,
    capacity: 50,
  },
  {
    name: 'COM-308',
    location: '3rd Floor',
    type: RoomType.CLASSROOM,
    capacity: 50,
  },
  {
    name: 'COM-309',
    location: '3rd Floor',
    type: RoomType.CLASSROOM,
    capacity: 50,
  },
  {
    name: 'Room 301',
    location: '3rd Floor',
    type: RoomType.OFFICE,
    capacity: 10,
  },
  {
    name: 'Room 305',
    location: '3rd Floor',
    type: RoomType.OFFICE,
    capacity: 10,
  },
  {
    name: 'Room 306',
    location: '3rd Floor',
    type: RoomType.OFFICE,
    capacity: 10,
  },
  {
    name: 'Department Head 1st Shift (Office)',
    location: '3rd Floor',
    type: RoomType.OFFICE,
    capacity: 5,
  },
];
