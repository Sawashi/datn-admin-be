import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Courses } from './course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Courses])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
