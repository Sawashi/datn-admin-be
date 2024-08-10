import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { DishDto } from 'src/dish/dto/dishDto.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Dish } from 'src/dish/dish.entity';

@ApiTags('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    eventsService: eventsService;
    cloudinaryService: cloudinaryService;
  }

  @Post()
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
  ) {
    const uploadedImage = await this.cloudinaryService.uploadImage(file);

    return this.eventsService.create(createEventDto, uploadedImage.secure_url);
  }

  @Get()
  @Roles(Role.Admin, Role.User)
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('/without-dishes')
  @Roles(Role.Admin, Role.User)
  findAllWithoutDishes() {
    return this.eventsService.findAllWithoutDishes();
  }

  @Get(':id')
  @Roles(Role.Admin, Role.User)
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Get(':id/top-dishes')
  async getEventRanking(
    @Param('id') id: number,
  ): Promise<
    { dish: Dish; filteredCollectionsCount: number; userImage: string | null }[]
  > {
    return this.eventsService.getEventRanking(id);
  }

  @Get(':id/my-ranking')
  async getMyRankingByEventId(
    @Param('id') id: number,
    @GetUser() loginUser: User,
  ): Promise<{
    filteredCollectionsCount: number;
  } | null> {
    return this.eventsService.getMyRankingByEventId(id, loginUser);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const uploadedImage = await this.cloudinaryService.uploadImage(file);
    return this.eventsService.update(
      +id,
      updateEventDto,
      uploadedImage.secure_url,
    );
  }

  @Patch('add-dish-to-event/:eventId')
  @UseInterceptors(FileInterceptor('image'))
  async addDishToEvent(
    @Param('eventId') eventId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dishDto: DishDto,
    @GetUser() loginUser: User,
  ): Promise<Event> {
    const uploadedImage = await this.cloudinaryService.uploadImage(file);

    return this.eventsService.addDishToEvent(
      eventId,
      dishDto,
      uploadedImage.secure_url,
      loginUser,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(+id);
  }
}
