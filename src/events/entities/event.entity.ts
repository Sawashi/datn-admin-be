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

  @ApiProperty({ type: () => [Dish] })
  @ManyToMany(() => Dish, { eager: true })
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

  getTopRankedDishes(): Dish[] {
    return this.dishes
      .sort((a, b) => b.collections.length - a.collections.length)
      .slice(0, 3);
  }
}
