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
  phoneNumber: string;

  @ApiProperty()
  @Column({ nullable: true })
  firstName: string;
  @ApiProperty()
  @Column({ nullable: true })
  lastName: string;
  @ApiProperty()
  @Column({ nullable: true })
  imgUrl: string;
  @ApiProperty()
  @Column({ nullable: true })
  gender: string;
  @ApiProperty()
  @Column({ nullable: true })
  description: string;
  @ApiProperty()
  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @OneToMany(() => Report, (report) => report.sender, { eager: true })
  sentReports: Report[];

  @OneToMany(() => Report, (report) => report.recipient, { eager: true })
  receivedReports: Report[];
}
