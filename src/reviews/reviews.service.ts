import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {
    reviewRepository: reviewRepository;
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: {
        user: true,
        dish: true,
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!review) throw new Error('Review not created');

    return await this.reviewRepository.save(review);
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.update(id, updateReviewDto);

    if (!review) throw new Error('Review not found');

    return await this.reviewRepository.findOne({
      where: { id },
    });
  }

  async delete(id: number): Promise<void> {
    const result = await this.reviewRepository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`Review with id ${id} not found`);
  }

  async deleteMany(ids: number[]): Promise<void> {
    await this.reviewRepository.delete(ids);
  }
}
