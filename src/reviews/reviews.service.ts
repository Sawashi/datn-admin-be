import { Injectable } from '@nestjs/common';
import { Review } from './review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReviewDTO } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {
    reviewRepository: reviewRepository;
  }

  // get all reviews
  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find();
  }

  // get one review
  async findOne(id: number): Promise<Review> {
    return await this.reviewRepository.findOne({ where: { id } });
  }

  // create review
  async create(createReviewDTO: CreateReviewDTO): Promise<Review> {
    const { dishId, userId, content } = createReviewDTO;

    const review = this.reviewRepository.create({
      dishId,
      userId,
      content,
      postedDate: new Date().toISOString(),
    });

    return await this.reviewRepository.save(review);
  }

  // update review
  async update(id: number, review: Review): Promise<Review> {
    await this.reviewRepository.update(id, review);
    return await this.reviewRepository.findOne({ where: { id } });
  }

  // delete review
  async delete(id: number): Promise<void> {
    await this.reviewRepository.delete(id);
  }

  // delete many by ids
  async deleteMany(ids: number[]): Promise<void> {
    await this.reviewRepository.delete(ids);
  }
}
