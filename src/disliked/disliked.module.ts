import { Module } from '@nestjs/common';
import { DislikedService } from './disliked.service';
import { DislikedController } from './disliked.controller';
import { Disliked } from './disliked.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Disliked])],
  providers: [DislikedService],
  controllers: [DislikedController],
})
export class DislikedModule {}
