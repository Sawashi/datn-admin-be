import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from './course.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Courses)
    private coursesRepository: Repository<Courses>,
  ) {
    coursesRepository: coursesRepository;
  }

  // get all courses
  async findAll(): Promise<Courses[]> {
    return await this.coursesRepository.find({
      relations: {
        dishes: true,
      },
    });
  }

  // get one courses
  async findOne(id: number): Promise<Courses> {
    return await this.coursesRepository.findOne({ where: { id } });
  }

  //create courses
  async create(courses: Courses): Promise<Courses> {
    const newcourses = this.coursesRepository.create(courses);
    return await this.coursesRepository.save(newcourses);
  }

  // update courses
  async update(id: number, courses: Courses): Promise<Courses> {
    await this.coursesRepository.update(id, courses);
    return await this.coursesRepository.findOne({ where: { id } });
  }

  // delete courses
  async delete(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}
