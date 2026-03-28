import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('face_api')
export class FaceApiEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  // Use 'jsonb' for Postgres or 'simple-json' for others
  @Column({ type: 'vector' })
  descriptor: number[];
}
