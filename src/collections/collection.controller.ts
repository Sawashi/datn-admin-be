import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection } from './collection.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CollectionDto } from './dto/collectionData.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@ApiTags('Collection')
@Controller('collection')
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

  // Create Collection
  @Post()
  @UseInterceptors(FileInterceptor('file')) // 'file' should match the field name in the form data
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() collectionDto: CollectionDto,
  ) {
    const { name } = collectionDto;
    console.log(collectionDto);

    // Upload file to Cloudinary
    const uploadedImage = await this.cloudinaryService.uploadImage(file);
    console.log('alo: ', uploadedImage);

    // Create collection with name and image URL
    const collection = new Collection();
    collection.collectionName = name;
    collection.imgUrl = uploadedImage.secure_url;
    return this.collectionService.create(collection);
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
}
