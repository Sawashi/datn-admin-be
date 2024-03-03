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
import { CreateReviewDTO } from './dto/create-review.dto';

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

  @Post()
  async create(@Body() createReviewDTO: CreateReviewDTO): Promise<Review> {
    console.log('createReviewDTO', createReviewDTO);
    return await this.reviewsService.create(createReviewDTO);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() review: Review,
  ): Promise<Review> {
    return this.reviewsService.update(id, review);
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
