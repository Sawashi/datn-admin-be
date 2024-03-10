import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('Report')
export class Report {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;
  @ApiProperty()
  @Column()
  title: string;
  @ApiProperty()
  @Column()
  content: string;
  @ApiProperty()
  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.sentReports, { eager: false })
  @Exclude({ toPlainOnly: true })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedReports, { eager: false })
  @Exclude({ toPlainOnly: true })
  recipient: User;
}
