import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { Record } from './record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diets } from 'src/diets/diets.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { Allergies } from 'src/allergies/allergies.entity';
import { User } from 'src/users/user.entity';
import { Topic } from 'src/topics/topic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Record, User, Diets, Cuisine, Allergies, Topic]),
  ],
  providers: [RecordService],
  controllers: [RecordController],
})
export class RecordModule {}
