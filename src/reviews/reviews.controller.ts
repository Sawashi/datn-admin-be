import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './review.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {
    reviewsService: reviewsService;
  }

  @Get()
  async findAll(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }
  @ApiOperation({
    summary: 'Get review',
    description: 'Get review by id',
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Review> {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return review;
  }

  @Get('dish/:dishId')
  async findByDishId(@Param('dishId') dishId: number): Promise<Review[]> {
    return await this.reviewsService.findByDishId(dishId);
  }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return await this.reviewsService.create(createReviewDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const review = await this.reviewsService.findOne(id);
    if (!review) {
      throw new Error('Review not found');
    }
    return this.reviewsService.delete(id);
  }

  @Delete()
  async deleteAll(@Param('ids') ids: number[]): Promise<void> {
    return this.reviewsService.deleteMany(ids);
  }
}
