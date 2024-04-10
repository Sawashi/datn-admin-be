import { ApiProperty } from '@nestjs/swagger';
import { Message } from 'src/messages/message.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('Topic')
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  userId: number;
  @ApiProperty()
  @Column()
  title: string;
  @OneToMany(() => Message, (message) => message.id, { eager: true })
  messageList: Message[];
}
