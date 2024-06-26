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
    cuisinesRepository: cuisinesRepository;
    cloudinaryService: cloudinaryService;
  }

  // get all cuisines
  async findAll(): Promise<Cuisine[]> {
    return await this.cuisinesRepository
      .createQueryBuilder('cuisine')
      .leftJoinAndSelect('cuisine.dishes', 'dish')
      .where('dish.deletedAt IS NULL')
      .getMany();
  }

  // get one cuisine
  async findOne(id: number): Promise<Cuisine> {
    return await this.cuisinesRepository.findOne({ where: { id } });
  }

  //create cuisine
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
    return await this.cuisinesRepository.findOne({ where: { id } });
  }

  // delete cuisine
  async delete(id: number): Promise<void> {
    await this.cuisinesRepository.delete(id);
  }
}
