import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Taboos')
export class Taboos {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  word: string;
}
