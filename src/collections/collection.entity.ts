import { ApiProperty } from '@nestjs/swagger';
import { Dish } from 'src/dish/dish.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
  JoinColumn,
  Unique,
} from 'typeorm';
@Entity('Collection')
@Unique(['userId', 'collectionName'])
export class Collection {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.collections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @Column()
  collectionName: string;

  @ApiProperty()
  @Column({ nullable: true })
  collectionDcrpt: string;

  @ManyToMany(() => Dish, (dish) => dish.collections)
  @JoinTable()
  dishes: Dish[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
