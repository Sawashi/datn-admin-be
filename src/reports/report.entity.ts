import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Report')
export class Report {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  title: string;
  @ApiProperty()
  @Column()
  content: string;
  @ApiProperty()
  @Column()
  status: string;
  @ApiProperty()
  @Column()
  userId: number;
  @ApiProperty()
  @Column()
  senderId: number;
}
