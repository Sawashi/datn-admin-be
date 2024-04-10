/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('Schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  userId: number;
  @ApiProperty()
  @Column()
  title: string;
  @ApiProperty()
  @Column()
  status: string;
  @ApiProperty()
  @Column()
  startDate: string;
  @ApiProperty()
  @Column()
  dishes: string;
}
