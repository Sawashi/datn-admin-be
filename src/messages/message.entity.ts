import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Topic } from 'src/topics/topic.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('Message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  content: string;

  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @Column({ nullable: true })
  response: string;

  @ManyToOne(() => Topic, (topic) => topic.messageList, { eager: false })
  @Exclude({ toPlainOnly: true })
  topicBelong: Topic;
}
