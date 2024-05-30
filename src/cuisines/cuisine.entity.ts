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
  OneToMany,
} from 'typeorm';

@Entity('Cuisine')
export class Cuisine {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  imgUrl: string;

  @ApiProperty()
  @OneToMany(() => Dish, (dish) => dish.cuisines)
  dishes: Dish[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Personalize, (personalize) => personalize.cuisines)
  personalize: Personalize[];

  @ManyToMany(() => Record, (record) => record.cuisines)
  records: Record[];
}
