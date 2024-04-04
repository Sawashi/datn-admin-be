import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('Schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ unique: true })
  userId: number;
  @ApiProperty()
  @Column({ unique: true })
  title: string;
  @ApiProperty()
  @Column({ unique: true })
  status: string;
  @ApiProperty()
  @Column({ unique: true })
  startDate: string;
  @ApiProperty()
  @Column({ unique: true })
  dishes: string;
}
