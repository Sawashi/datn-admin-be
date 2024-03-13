import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  categoryName: string;
  @ApiProperty()
  @Column()
  description: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
