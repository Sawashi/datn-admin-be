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

@ApiTags('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Roles(Role.Admin, Role.User)
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
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(+id, updateEventDto);
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
