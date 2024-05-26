import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dish } from 'src/dish/dish.entity';
import { User } from 'src/users/user.entity';
@Entity('Note')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  noteTitle: string;

  @ApiProperty()
  @Column()
  noteContent: string;

  @ApiProperty()
  @Column({ name: 'dish_id' })
  dishId: number;

  @ManyToOne(() => Dish, (dish) => dish.notes)
  @JoinColumn({ name: 'dish_id' })
  dish: Dish;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.notes)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
