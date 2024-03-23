import { ApiProperty } from '@nestjs/swagger';
import { Report } from 'src/reports/report.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @ApiProperty()
  @Column({ nullable: true })
  email: string;

  @Column({ unique: true })
  username: string;

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
  @Column({ nullable: true })
  createdAt: string;
  @Column({ nullable: true })
  updatedAt: string;
  @Column({ nullable: true })
  status: string;
  @Column({ nullable: true })
  role: string;

  @OneToMany(() => Report, (report) => report.sender, { eager: true })
  sentReports: Report[];
  @OneToMany(() => Report, (report) => report.recipient, { eager: true })
  receivedReports: Report[];
}
