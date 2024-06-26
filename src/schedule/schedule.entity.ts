import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => User, (user) => user.schedules, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User;
}
