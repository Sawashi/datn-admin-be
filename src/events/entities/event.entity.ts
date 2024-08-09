import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Dish } from 'src/dish/dish.entity';

@Entity('Event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  eventName: string;

  @ApiProperty()
  @Column({ type: 'date' })
  startTime: Date;

  @ApiProperty()
  @Column({ type: 'date' })
  endTime: Date;

  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty({ type: () => [Dish] })
  @ManyToMany(() => Dish)
  @JoinTable()
  dishes: Dish[];

  @ApiProperty()
  @Column()
  reward: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
