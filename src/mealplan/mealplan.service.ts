import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealplanDish } from 'src/dish/dish_mealplan.entity';
import { Repository } from 'typeorm';
import { MealPlan } from './mealplan.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class MealplanService {
  constructor(
    @InjectRepository(MealplanDish)
    private readonly mealplanDishRepository: Repository<MealplanDish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(MealPlan)
    private mealPlanRepository: Repository<MealPlan>,
  ) {
    mealplanDishRepository;
    mealPlanRepository;
    userRepository;
  }

  async getDishesWithPlanDateByUserId(userId: number) {
    return await this.mealplanDishRepository.find({
      relations: ['dish'],
      where: {
        mealPlan: {
          user_id: userId,
        },
      },
    });
  }
  async addDishToMealPlan(mealPlanId: number, dishId: number, planDate: Date) {
    const newDish = await this.mealplanDishRepository.create({
      mealPlanId: mealPlanId,
      dishId: dishId,
      planDate: planDate,
    });
    return await this.mealplanDishRepository.save(newDish);
  }

  async deleteDishFromMealPlan(dishId: number) {
    const deleteMealPlan = await this.mealplanDishRepository.findOne({
      where: { dishId },
    });

    return await this.mealplanDishRepository.delete(deleteMealPlan.id);
  }
}
