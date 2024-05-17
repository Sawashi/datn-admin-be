import { ApiProperty } from '@nestjs/swagger';
import { Dish } from 'src/dish/dish.entity';
import { Personalize } from 'src/personalize/personalize.entity';
import { Record } from 'src/record/record.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity('Diets')
export class Diets {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  dietName: string;

  @ApiProperty()
  @Column()
  imgUrl: string;

  @ApiProperty()
  @ManyToMany(() => Dish, (dish) => dish.diets)
  dishes: Dish[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Personalize, (personalize) => personalize.diets)
  personalize: Personalize[];

  @ManyToMany(() => Record, (record) => record.diets)
  records: Record[];
}
