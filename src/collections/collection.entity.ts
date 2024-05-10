import { ApiProperty } from '@nestjs/swagger';
// import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  // ManyToMany,
  // ManyToOne,
} from 'typeorm';

@Entity('Collection')
export class Collection {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  // @ManyToOne(() => User, (user) => user.collections)
  // user: User

  @ApiProperty()
  @Column()
  collectionName: string;

  @ApiProperty()
  @Column()
  imgUrl: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
