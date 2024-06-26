import { ApiProperty } from '@nestjs/swagger';
import { Allergies } from 'src/allergies/allergies.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';
import { Topic } from 'src/topics/topic.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('Record')
export class Record {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  nameRecord: string;

  @ApiProperty()
  @Column({ default: 0 })
  meal: number;

  @ApiProperty()
  @Column({ nullable: true, default: 0 })
  money: number;

  @ApiProperty()
  @Column()
  numberOfDiners: number;

  @ManyToOne(() => User, (user) => user.records)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Cuisine, (cuisine) => cuisine.records)
  @JoinTable()
  cuisines: Cuisine[];

  @ManyToMany(() => Allergies, (allergies) => allergies.records)
  @JoinTable()
  allergies: Allergies[];

  @ManyToMany(() => Diets, (diets) => diets.records)
  @JoinTable()
  diets: Diets[];

  @OneToMany(() => Topic, (topic) => topic.record)
  topics: Topic[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column({ default: 0 })
  typeSuggest: number;

  @ApiProperty()
  @Column({ default: true })
  active: boolean;
}
