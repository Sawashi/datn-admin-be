import { ApiProperty } from '@nestjs/swagger';
import { Message } from 'src/messages/message.entity';
import { Record } from 'src/record/record.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('Topic')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.topics)
  user: User;

  @ApiProperty()
  @Column()
  title: string;

  @OneToMany(() => Message, (message) => message.topicBelong, { eager: true })
  messageList: Message[];

  @OneToOne(() => Record, (record) => record.topic)
  @JoinColumn()
  record: Record;

  @ApiProperty()
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;
}
