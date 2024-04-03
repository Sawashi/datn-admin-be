import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('Schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  startDate: string;
  @ApiProperty()
  dishes: string;
}
