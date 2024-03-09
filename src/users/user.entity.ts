import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  email: string;
  @ApiProperty()
  @Column()
  phoneNumber: string;
  @ApiProperty()
  @Column()
  firstName: string;
  @ApiProperty()
  @Column()
  lastName: string;
  @ApiProperty()
  @Column()
  imgUrl: string;
  @ApiProperty()
  @Column()
  gender: string;
  @ApiProperty()
  @Column()
  description: string;
  @ApiProperty()
  @Column()
  dateOfBirth: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
