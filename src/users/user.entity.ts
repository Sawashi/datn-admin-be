import { ApiProperty } from '@nestjs/swagger';
import { Report } from 'src/reports/report.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
  @OneToMany(() => Schedule, (schedule) => schedule.userId, { eager: true })
  userSchedules: Schedule[];
}
