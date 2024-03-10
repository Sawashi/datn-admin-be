import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number = 0;

  @ApiProperty()
  @Column({ nullable: false })
  email: string = '';

  @ApiProperty()
  @Column({ nullable: false })
  phoneNumber: string = '';

  @ApiProperty()
  @Column({ nullable: false })
  firstName: string = '';

  @ApiProperty()
  @Column()
  lastName: string = '';

  @ApiProperty()
  @Column()
  imgUrl: string = '';

  @ApiProperty()
  @Column()
  gender: string = '';

  @ApiProperty()
  @Column()
  description: string = '';

  @ApiProperty()
  @Column()
  dateOfBirth: string = '';

  @Column({ nullable: false })
  password: string = '';

  @CreateDateColumn()
  createdAt: Date = new Date();
}
