import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Feedbacks')
export class FeedBacks {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  likePoint: number;

  @ApiProperty()
  @Column()
  reason: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  userid: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
