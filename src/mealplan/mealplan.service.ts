import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MealplanDish } from 'src/dish/dish_mealplan.entity';
import { Between, IsNull, Repository } from 'typeorm';
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

  async getMealplanIdByUserId(userId: number): Promise<number> {
    const mealPlan = await this.mealPlanRepository.findOne({
      where: { user_id: userId },
    });

    if (!mealPlan) {
      throw new Error('Meal Plan not found for the given user');
    }

    return mealPlan.id;
  }

  async getDishesWithPlanDateByUserId(userId: number, weekOffset: number = 0) {
    const today = new Date();
    const startOfWeek = new Date(
      today.setDate(today.getDate() - today.getDay() + weekOffset * 7),
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

    const unscheduledDishes = await this.mealplanDishRepository.find({
      relations: ['dish'],
      where: {
        mealPlan: {
          user_id: userId,
        },
        planDate: IsNull(),
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

    groupedDishes.push({ day: 'Unscheduled', dishes: unscheduledDishes });

    return groupedDishes;
  }

  async getDishesWithPlanDateByUserIdForToday(
    userId: number,
    dayOffset: number = 0,
  ) {
    const today = new Date();
    const targetDate = new Date(today.setDate(today.getDate() + dayOffset));
    targetDate.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dishes = await this.mealplanDishRepository.find({
      relations: ['dish'],
      where: {
        mealPlan: {
          user_id: userId,
        },
        planDate: Between(targetDate, endOfDay),
      },
      //
    });

    const unscheduledDishes = await this.mealplanDishRepository.find({
      relations: ['dish'],
      where: {
        mealPlan: {
          user_id: userId,
        },
        planDate: IsNull(),
      },
    });

    return {
      day: targetDate.toDateString(),
      dishes: dishes,
      unscheduledDishes: unscheduledDishes,
    };
  }

  async addDishToMealPlan(mealPlanId: number, dishId: number, planDate: Date) {
    const newDish = await this.mealplanDishRepository.create({
      mealPlanId: mealPlanId,
      dishId: dishId,
      planDate: planDate,
    });
    return await this.mealplanDishRepository.save(newDish);
  }

  async addMealPlanForUser(userId: number) {
    const newMealPlan = await this.mealPlanRepository.create({
      user_id: userId,
    });
    return await this.mealPlanRepository.save(newMealPlan);
  }

  async updatePlanDate(mealPlanId: number, dishId: number, planDate: Date) {
    const mealplanDish = await this.mealplanDishRepository.findOne({
      where: { mealPlanId: mealPlanId, dishId: dishId },
    });

    if (!mealplanDish) {
      throw new Error('MealplanDish not found');
    }

    mealplanDish.planDate = planDate;

    return await this.mealplanDishRepository.save(mealplanDish);
  }

  async deleteDishFromMealPlan(dishId: number, mealPlanId: number) {
    const deleteMealPlan = await this.mealplanDishRepository.findOne({
      where: { dishId: dishId, mealPlanId: mealPlanId },
    });

    if (deleteMealPlan) {
      await this.mealplanDishRepository.delete(deleteMealPlan.id);
      return { success: true, message: 'Dish deleted from meal plan' };
    } else {
      return { success: false, message: 'Dish not found in meal plan' };
    }
  }

  async deleteAllByUser(userId: number) {
    const mealPlans = await this.mealPlanRepository.find({
      where: { user_id: userId },
      relations: ['mealplanDishes'],
    });

    if (mealPlans.length === 0) {
      throw new Error('No meal plans found for the given user');
    }

    for (const mealPlan of mealPlans) {
      await this.mealplanDishRepository.delete({
        mealPlanId: mealPlan.id,
      });
    }

    return {
      success: true,
      message: 'All meal plans and associated dishes deleted for the user',
    };
  }

  //  check if a dish is in the user's mealplan
  async isDishInMealPlan(dishId: number, mealplanId: number): Promise<boolean> {
    const userMealplan = await this.mealplanDishRepository.findOne({
      where: { mealPlan: { id: mealplanId }, dish: { id: dishId } },
    });
    return !!userMealplan;
  }
}
