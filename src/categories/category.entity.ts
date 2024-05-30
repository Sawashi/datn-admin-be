import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  name: string;
  @ApiProperty()
  @Column()
  route: string;
  @ApiProperty()
  @Column()
  imgUrl: string;
  @ApiProperty()
  @CreateDateColumn({ nullable: true })
  createdAt: Date;
  @ApiProperty()
  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;
}
