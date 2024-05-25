import { ApiProperty } from '@nestjs/swagger';
import { Collection } from 'src/collections/collection.entity';

import { MealPlan } from 'src/mealplan/mealplan.entity';
import { Note } from 'src/notes/notes.entity';
import { Personalize } from 'src/personalize/personalize.entity';
import { Report } from 'src/reports/report.entity';
import { Review } from 'src/reviews/review.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  email: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  imgUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  gender: string;

  @ApiProperty()
  @Column({ nullable: true })
  dateOfBirth: string;

  @ApiProperty()
  @Column({ nullable: true })
  createdAt: string;

  @ApiProperty()
  @Column({ nullable: true })
  updatedAt: string;

  @ApiProperty()
  @Column({ nullable: true })
  status: string;

  @ApiProperty()
  @Column({ nullable: true })
  role: string;

  @OneToMany(() => Report, (report) => report.sender, { eager: true })
  sentReports: Report[];

  @OneToMany(() => Report, (report) => report.recipient, { eager: true })
  receivedReports: Report[];

  @OneToMany(() => Schedule, (schedule) => schedule.user, { eager: true })
  schedules: Schedule[]; // Changed property name from userSchedules to schedules

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToOne(() => Personalize, (personalize) => personalize.user, {
    eager: true,
  })
  personalize: Personalize;

  @OneToOne(() => MealPlan, (mealPlan) => mealPlan.user)
  mealPlan: MealPlan;

  @OneToMany(() => Collection, (collection) => collection.user)
  collections: Collection[];
}
