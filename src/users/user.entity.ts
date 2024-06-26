import { ApiProperty } from '@nestjs/swagger';
import { Collection } from 'src/collections/collection.entity';
import { FeedbackApps } from 'src/feedback-apps/entities/feedback-app.entity';

import { MealPlan } from 'src/mealplan/mealplan.entity';
import { Note } from 'src/notes/notes.entity';
import { Personalize } from 'src/personalize/personalize.entity';
import { Record } from 'src/record/record.entity';
import { Report } from 'src/reports/report.entity';
import { Review } from 'src/reviews/review.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Topic } from 'src/topics/topic.entity';
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

  @ApiProperty()
  @Column({ nullable: true })
  isLogin: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  notificationToken: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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

  @OneToMany(() => Topic, (topic) => topic.user)
  topics: Topic[];

  @OneToMany(() => Record, (record) => record.user)
  records: Record[];

  @OneToMany(() => FeedbackApps, (feedback) => feedback.user)
  feedbacks: FeedbackApps[];

  @ApiProperty()
  @Column({ default: true })
  isSuggest: boolean;
}
