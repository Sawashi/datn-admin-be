import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DishService } from 'src/dish/dish.service';
import { Dish } from 'src/dish/dish.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Dish)
    private dishRepository: Repository<Dish>,
    private readonly dishService: DishService,
  ) {
    reviewRepository: reviewRepository;
    dishRepository: dishRepository;
    dishService: dishService;
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: {
        user: true,
        dish: true,
        reportReviews: true,
      },
    });
  }

  async findOne(id: number): Promise<Review> {
    const found = await this.reviewRepository.findOne({ where: { id } });

    if (!found) throw new NotFoundException(`Review with id ${id} not found`);
    return found;
  }

  async findByDishId(dishId: number): Promise<Review[]> {
    return await this.reviewRepository.find({ where: { dishId } });
  }

  async create(createReviewDTO: CreateReviewDto): Promise<Review> {
    const { dishId, userId, rating, content } = createReviewDTO;

    const review = this.reviewRepository.create({
      dishId,
      userId,
      rating,
      content,
    });

    if (!review) throw new Error('Review not created');

    const newReview = await this.reviewRepository.save(review);
    if (newReview) {
      await this.dishService.updateAverageRating(newReview.dishId);
    } else {
      throw new Error('Review is not save');
    }
    return newReview;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const newReview = await this.reviewRepository.update(id, updateReviewDto);
    if (!newReview) throw new Error('Review not found');

    const thisReview = await this.findOne(id);
    if (thisReview) {
      await this.dishService.updateAverageRating(thisReview.dishId);
    } else {
      throw new Error('Review not found');
    }
    return thisReview;
  }

  async delete(id: number): Promise<void> {
    const result = await this.reviewRepository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`Review with id ${id} not found`);
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.reviewRepository.delete(ids);
  }
  // get review by userId
  async findReviewByUserIdAndDish(
    userId: number,
    dishId: number,
  ): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { user: { id: userId }, dish: { id: dishId } },
      relations: {
        user: true,
        dish: true,
      },
    });
  }
}
