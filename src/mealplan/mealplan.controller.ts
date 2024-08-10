import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MealplanService } from './mealplan.service';
import {
  AddDishToMealPlanDto,
  UpdateDishToMealPlanDto,
} from 'src/dish/dto/disMealplanDto';
import { DeleteDishFromMealPlanDto } from './dto/deleteDishMealPlanDto';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { AddMealPlanForUserDto } from './dto/addMealPlanUser.dto';

@ApiTags('mealplan')
@Controller('mealplan')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class MealplanController {
  constructor(private readonly mealPlanService: MealplanService) {
    this.mealPlanService = mealPlanService;
  }

  @Get(':userId')
  async getDishesWithPlanDateByUserId(
    @Param('userId') userId: number,
    @Query('weekOffset') weekOffset: string,
  ) {
    const weekOffsetNumber = parseInt(weekOffset, 10) || 0;
    return await this.mealPlanService.getDishesWithPlanDateByUserId(
      userId,
      weekOffsetNumber,
    );
  }

  @Get('user/:userId')
  async getMealplanIdByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ mealplanId: number }> {
    const mealplanId = await this.mealPlanService.getMealplanIdByUserId(userId);
    return { mealplanId };
  }

  @Get(':userId/today')
  async getDishesWithPlanDateByUserIdForToday(
    @Param('userId') userId: number,
    @Query('dayOffset') dayOffset: string,
  ) {
    const dayOffsetNumber = parseInt(dayOffset, 10) || 0;
    return await this.mealPlanService.getDishesWithPlanDateByUserIdForToday(
      userId,
      dayOffsetNumber,
    );
  }

  @Get('dateMealplan/:mealPlanId/dish/:dishId')
  async getDateByMealPlanDish(
    @Param('mealPlanId') mealPlanId: number,
    @Param('dishId') dishId: number,
  ) {
    return await this.mealPlanService.getPlanDateByMealPlan(mealPlanId, dishId);
  }
  @Post()
  async addDishtoMealPlan(@Body() addDishToMealPlanDto: AddDishToMealPlanDto) {
    const { mealPlanId, dishId, planDate } = addDishToMealPlanDto;

    return await this.mealPlanService.addDishToMealPlan(
      mealPlanId,
      dishId,
      planDate,
    );
  }

  @Post('user-mealplan')
  async addMealPlanForUser(
    @Body() addMealPlanForUserDto: AddMealPlanForUserDto,
  ) {
    const { userId } = addMealPlanForUserDto;

    return await this.mealPlanService.addMealPlanForUser(userId);
  }

  @Patch('mealplanDish/:mpDishId')
  async updatePlanDateByMpDishId(
    @Param('mpDishId') mpDishId: number,
    @Body() planDate: Date,
  ) {
    return await this.mealPlanService.updatePlanDateByMpDishId(
      mpDishId,
      planDate,
    );
  }

  @Patch('update-plan-date')
  async updatePlanDate(@Body() updatePlanDateDto: UpdateDishToMealPlanDto) {
    const { mealPlanId, dishId, planDate } = updatePlanDateDto;
    return await this.mealPlanService.updatePlanDate(
      mealPlanId,
      dishId,
      planDate,
    );
  }

  @Delete()
  async deleteDishFromMealPlan(
    @Body() deleteDishMealPlanDto: DeleteDishFromMealPlanDto,
  ) {
    const { dishId, mealPlanId, planDate } = deleteDishMealPlanDto;

    return await this.mealPlanService.deleteDishFromMealPlan(
      dishId,
      mealPlanId,
      planDate,
    );
  }

  @Delete('deleteAllDish')
  async deleteAllDishFromMealPlan(
    @Body() deleteDishMealPlanDto: DeleteDishFromMealPlanDto,
  ) {
    const { dishId, mealPlanId } = deleteDishMealPlanDto;

    return await this.mealPlanService.deleteAllDishFromMealPlan(
      dishId,
      mealPlanId,
    );
  }
  // check if a dish is in the user's mealplan
  @Get('in-mealplan/:mealPlanId/dish/:dishId')
  async isDishInMealPlan(
    @Param('dishId') dishId: number,
    @Param('mealPlanId') mealPlanId: number,
  ): Promise<{ isInMealPlan: boolean }> {
    console.log(dishId);
    const isInMealPlan = await this.mealPlanService.isDishInMealPlan(
      dishId,
      mealPlanId,
    );
    return { isInMealPlan };
  }

  @Delete('user/:userId')
  async deleteAllByUser(@Param('userId', ParseIntPipe) userId: number) {
    const result = await this.mealPlanService.deleteAllByUser(userId);
    return result;
  }

  @Get('dishes/date')
  async getDishedMealPlan(
    @Query('planDate') planDate: string,
    @Query('mealPlanId', ParseIntPipe) mealPlanId: number,
  ): Promise<number[]> {
    const date = new Date(planDate);
    return await this.mealPlanService.getDishedMealPlan(date, mealPlanId);
  }
}
