import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Collection } from 'src/collections/collection.entity';
import { Topic } from 'src/topics/topic.entity';
import { MealPlan } from 'src/mealplan/mealplan.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(MealPlan)
    private mealplanRepository: Repository<MealPlan>,
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
  ) {
    usersRepository: usersRepository;
    collectionsRepository: collectionsRepository;
    topicsRepository: topicsRepository;
    mealplanRepository: mealplanRepository;
  }

  // get all users
  async findall(): Promise<User[]> {
    return await this.usersRepository.find({
      relations: {
        reviews: true,
        notes: true,
        collections: true,
        records: true,
      },
    });
  }

  // get one user
  async findOne(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: { id },
      relations: {
        reviews: true,
        notes: true,
        collections: true,
        topics: true,
        records: {
          diets: true,
          allergies: true,
          cuisines: true,
        },
      },
    });
  }

  //create user
  async create(user: User): Promise<User> {
    const newUser = this.usersRepository.create(user);
    newUser.role = 'user';

    try {
      const savedUser = await this.usersRepository.save(newUser);

      // Create topic default for new user
      const colAllPersonal = this.collectionsRepository.create({
        collectionName: 'All Personal Recipes',
        user: savedUser,
      });
      const colBreakfast = this.collectionsRepository.create({
        collectionName: 'Breakfasts',
        user: savedUser,
      });
      const colDinner = this.collectionsRepository.create({
        collectionName: 'Dinners',
        user: savedUser,
      });
      const colDessert = this.collectionsRepository.create({
        collectionName: 'Desserts',
        user: savedUser,
      });

      await this.collectionsRepository.save(colAllPersonal);
      await this.collectionsRepository.save(colBreakfast);
      await this.collectionsRepository.save(colDinner);
      await this.collectionsRepository.save(colDessert);

      // Create first topic for user
      const newTopic = this.topicsRepository.create({
        title: 'New suggestion',
        user: savedUser,
      });

      await this.topicsRepository.save(newTopic);

      savedUser.topics = [newTopic];

      savedUser.collections = [
        colAllPersonal,
        colBreakfast,
        colDinner,
        colDessert,
      ];

      //console.log('>>>', savedUser);

      const mealPlan = this.mealplanRepository.create({
        user_id: savedUser?.id,
      });

      await this.mealplanRepository.save(mealPlan);
      savedUser.mealPlan = mealPlan;
      return savedUser;
    } catch (error) {
      if (error.code === '23505') {
        // Unique constraint violation
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // update user
  async update(id: number, user: User): Promise<User> {
    await this.usersRepository.update(id, user);
    return await this.usersRepository.findOne({ where: { id } });
  }

  // delete user
  async delete(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  // change user status
  async changeStatus(id: number, status: string): Promise<User> {
    await this.usersRepository.update(id, { status });
    return await this.usersRepository.findOne({ where: { id } });
  }
}
