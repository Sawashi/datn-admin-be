import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Report')
export class Report {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  status: string;
  @Column()
  userId: number;
  @Column()
  senderId: number;
}
