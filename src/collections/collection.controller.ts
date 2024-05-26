import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection } from './collection.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CollectionDto } from './dto/collectionData.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@ApiTags('Collection')
@Controller('collections')
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    collectionService: collectionService;
    cloudinaryService: cloudinaryService;
  }

  // Get all Collections
  @Get()
  async findAll(): Promise<Collection[]> {
    console.log('ccc');
    return await this.collectionService.findAll();
  }
  @ApiOperation({
    summary: 'Get Collection',
    description: 'Get Collection by id',
  })
  // Get one Collection
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Collection> {
    const collection = await this.collectionService.findOne(id);
    if (!collection) {
      throw new Error('Collection not found');
    }
    return collection;
  }
  @ApiOperation({
    summary: 'Get Collections by User ID',
    description: 'Get Collections by user ID',
  })
  @Get('/user/:userId')
  async findByUserId(@Param('userId') userId: number): Promise<Collection[]> {
    return await this.collectionService.findByUserId(userId);
  }

  // check if a dish is in the user's collection
  @Get('user/:userId/dish/:dishId')
  async isDishInCollection(
    @Param('userId') userId: number,
    @Param('dishId') dishId: number,
  ): Promise<{ exists: boolean }> {
    const isInCollection = await this.collectionService.isDishInCollection(
      userId,
      dishId,
    );
    return { exists: isInCollection };
  }

  @Post()
  async create(@Body() collectionDto: CollectionDto) {
    const { userId, name, description } = collectionDto;
    const collection = new Collection();
    collection.collectionName = name;
    collection.userId = userId;
    collection.collectionDcrpt = description;
    try {
      return await this.collectionService.create(collection);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Update Collection
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() collection: Collection,
  ): Promise<Collection> {
    return this.collectionService.update(id, collection);
  }

  // Delete Collection
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const collection = await this.collectionService.findOne(id);
    if (!collection) {
      throw new Error('User not found');
    }
    return this.collectionService.delete(id);
  }
  // Check if collection name exists for a user
  @Get('/exists/:userId/:name')
  async isCollectionNameExists(
    @Param('userId') userId: number,
    @Param('name') name: string,
  ): Promise<{ exists: boolean }> {
    const exists = await this.collectionService.isCollectionNameExists(
      userId,
      name,
    );
    return { exists };
  }

  @Post('user/:userId/dishes/:dishId')
  async addDishToCollections(
    @Param('userId') userId: number,
    @Param('dishId') dishId: number,
    @Body('collectionIds') collectionIds: number[],
  ) {
    await this.collectionService.addDishToCollections(
      userId,
      dishId,
      collectionIds,
    );
  }
  @Get('user/:userId/dishes/:dishId')
  async getCollectionsWithDishFlag(
    @Param('userId') userId: number,
    @Param('dishId') dishId: number,
  ) {
    const collections = await this.collectionService.getCollectionsWithDishFlag(
      userId,
      dishId,
    );
    return collections;
  }
}
