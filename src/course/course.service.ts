// import { Injectable } from '@nestjs/common';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Courses } from './course.entity';

// @Injectable()
// export class CourseService {
//   constructor(
//     @InjectRepository(Courses)
//     private coursesRepository: Repository<Courses>,
//   ) {
//     coursesRepository: coursesRepository;
//   }

//   // get all courses
//   async findAll(): Promise<Courses[]> {
//     return await this.coursesRepository.find({
//       relations: {
//         dishes: true,
//       },
//     });
//   }

//   // get one courses
//   async findOne(id: number): Promise<Courses> {
//     return await this.coursesRepository.findOne({ where: { id } });
//   }

//   //create courses
//   async create(courses: Courses): Promise<Courses> {
//     const newcourses = this.coursesRepository.create(courses);
//     return await this.coursesRepository.save(newcourses);
//   }

//   // update courses
//   async update(id: number, courses: Courses): Promise<Courses> {
//     await this.coursesRepository.update(id, courses);
//     return await this.coursesRepository.findOne({ where: { id } });
//   }

//   // delete courses
//   async delete(id: number): Promise<void> {
//     await this.coursesRepository.delete(id);
//   }
// }
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from './course.entity';
//import { Dish } from 'src/dish/dish.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Courses)
    private coursesRepository: Repository<Courses>,
  ) {
    coursesRepository;
  }

  // get all courses
  async findAll(): Promise<Courses[]> {
    return await this.coursesRepository.find({
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findAll1(
    page: number,
    limit: number,
  ): Promise<{
    data: Courses[];
    count: number;
    currentPage: number;
    totalPages: number;
  }> {
    const [result, total] = await this.coursesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });

    return {
      data: result,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
  // get one course
  async findOne(id: number): Promise<Courses> {
    return await this.coursesRepository.findOne({
      where: { id },
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });
  }

  // create course
  async create(course: Courses): Promise<Courses> {
    const newCourse = this.coursesRepository.create(course);
    return await this.coursesRepository.save(newCourse);
  }

  // update course
  async update(id: number, course: Courses): Promise<Courses> {
    await this.coursesRepository.update(id, course);
    return await this.coursesRepository.findOne({
      where: { id },
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });
  }

  // delete course
  async delete(id: number): Promise<void> {
    await this.coursesRepository.delete(id);
  }
}
