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
  UseGuards,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { Collection } from './collection.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CollectionDto } from './dto/collectionData.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';

@ApiTags('Collection')
@Controller('collections')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
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
