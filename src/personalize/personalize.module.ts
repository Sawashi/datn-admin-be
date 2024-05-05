import { Module } from '@nestjs/common';
import { PersonalizeService } from './personalize.service';
import { PersonalizeController } from './personalize.controller';
import { Personalize } from './personalize.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Personalize])],
  providers: [PersonalizeService],
  controllers: [PersonalizeController],
})
export class PersonalizeModule {}
