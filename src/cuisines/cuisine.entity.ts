import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Cuisine')
export class Cuisine {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  cuisineName: string;
  @ApiProperty()
  @Column()
  description: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
