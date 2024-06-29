import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('FeedbackApps')
export class FeedbackApps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  content: string;

  @Column({
    nullable: true,
  })
  type: string;

  @ManyToOne(() => User, (user) => user.feedbacks)
  user: User;
}
