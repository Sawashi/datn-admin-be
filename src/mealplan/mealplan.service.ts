import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealplanDish } from 'src/dish/dish_mealplan.entity';
import { Between, Repository } from 'typeorm';
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
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay()),
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const dishes = await this.mealplanDishRepository.find({
      relations: ['dish'],
      where: {
        mealPlan: {
          user_id: userId,
        },
        planDate: Between(startOfWeek, endOfWeek),
      },
    });

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const groupedDishes = daysOfWeek.map((day) => ({ day, dishes: [] }));

    dishes.forEach((dish) => {
      const planDate = new Date(dish.planDate);
      const dayOfWeek = planDate.getDay();
      groupedDishes[dayOfWeek].dishes.push(dish);
    });

    return groupedDishes.filter((group) => group.dishes.length > 0);
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
