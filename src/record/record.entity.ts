import { ApiProperty } from '@nestjs/swagger';
import { Allergies } from 'src/allergies/allergies.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Diets } from 'src/diets/diets.entity';
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

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
