import { ApiProperty } from '@nestjs/swagger';
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

@Entity('Allergies')
export class Allergies {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column()
  allergiesName: string;

  @ApiProperty()
  @Column()
  imgUrl: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Personalize, (personalize) => personalize.allergies)
  personalize: Personalize[];

  @ManyToMany(() => Record, (record) => record.allergies)
  records: Record[];
}
