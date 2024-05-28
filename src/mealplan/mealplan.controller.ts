import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  @Post()
  async addDishtoMealPlan(@Body() addDishToMealPlanDto: AddDishToMealPlanDto) {
    const { mealPlanId, dishId } = addDishToMealPlanDto;

    return await this.mealPlanService.addDishToMealPlan(mealPlanId, dishId);
  }

  @Post('user-mealplan')
  async addMealPlanForUser(
    @Body() addMealPlanForUserDto: AddMealPlanForUserDto,
  ) {
    const { userId } = addMealPlanForUserDto;

    return await this.mealPlanService.addMealPlanForUser(userId);
  }

  @Patch('update-plan-date')
  async updatePlanDate(@Body() updatePlanDateDto: UpdateDishToMealPlanDto) {
    const { mealPlanId, dishId, planDate } = updatePlanDateDto;
    return await this.mealPlanService.updatePlanDate(
      mealPlanId,
      dishId,
      new Date(planDate),
    );
  }

  @Delete()
  async deleteDishFromMealPlan(
    @Body() deleteDishMealPlanDto: DeleteDishFromMealPlanDto,
  ) {
    const { dishId, mealPlanId } = deleteDishMealPlanDto;

    return await this.mealPlanService.deleteDishFromMealPlan(
      dishId,
      mealPlanId,
    );
  }

  // check if a dish is in the user's mealplan
  @Get('in-mealplan/:mealPlanId/dish/:dishId')
  async isDishInMealPlan(
    @Param('dishId') dishId: number,
    @Param('mealPlanId') mealPlanId: number,
  ): Promise<{ exists: boolean }> {
    console.log(dishId);
    const isInMealPlan = await this.mealPlanService.isDishInMealPlan(
      dishId,
      mealPlanId,
    );
    return { exists: isInMealPlan };
  }
}
