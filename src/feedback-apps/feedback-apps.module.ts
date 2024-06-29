import { Module } from '@nestjs/common';
import { FeedbackAppsService } from './feedback-apps.service';
import { FeedbackAppsController } from './feedback-apps.controller';
import { User } from 'src/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackApps } from './entities/feedback-app.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, FeedbackApps])],
  controllers: [FeedbackAppsController],
  providers: [FeedbackAppsService],
})
export class FeedbackAppsModule {}
