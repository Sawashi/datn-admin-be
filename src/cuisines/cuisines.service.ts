import { BadRequestException, Injectable } from '@nestjs/common';
import { Cuisine } from './cuisine.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CuisinesService {
  constructor(
    @InjectRepository(Cuisine)
    private cuisinesRepository: Repository<Cuisine>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    cuisinesRepository;
    cloudinaryService;
  }

  // get all cuisines
  async findAll(): Promise<Cuisine[]> {
    return await this.cuisinesRepository.find({
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
      where: {
        dishes: {
          deletedAt: null,
        },
      },
    });
  }
  async findAll1(
    page: number,
    limit: number,
  ): Promise<{
    data: Cuisine[];
    count: number;
    currentPage: number;
    totalPages: number;
  }> {
    const [result, total] = await this.cuisinesRepository.findAndCount({
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
      where: {
        dishes: {
          deletedAt: null,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      count: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
  // get one cuisine
  async findOne(id: number): Promise<Cuisine> {
    return await this.cuisinesRepository.findOne({
      where: { id },
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });
  }

  // create cuisine
  async create(cuisine: Cuisine, image: Express.Multer.File): Promise<Cuisine> {
    if (!image) {
      throw new BadRequestException('Image file is required');
    }

    // Upload image to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(image);

    // Add image URL to cuisine data
    cuisine.imgUrl = uploadResult.secure_url;

    // Save cuisine data to the database
    const newCuisine = this.cuisinesRepository.create(cuisine);
    return await this.cuisinesRepository.save(newCuisine);
  }

  // update cuisine
  async update(id: number, cuisine: Cuisine): Promise<Cuisine> {
    await this.cuisinesRepository.update(id, cuisine);
    return await this.cuisinesRepository.findOne({
      where: { id },
      relations: {
        dishes: {
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });
  }

  // delete cuisine
  async delete(id: number): Promise<void> {
    await this.cuisinesRepository.delete(id);
  }
}
