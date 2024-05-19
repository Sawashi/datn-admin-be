import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.messagesService = messagesService;
    cloudinaryService: cloudinaryService;
  }

  //get all messages
  @ApiOkResponse({
    description: 'All messages records',
    type: Message,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<Message[]> {
    return await this.messagesService.findall();
  }
  //get one messages
  @ApiOkResponse({
    description: 'Record of a single topic',
    type: Message,
    isArray: false,
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Message> {
    const messages = await this.messagesService.findOne(id);
    if (!messages) {
      throw new Error('Message not found');
    } else {
      return messages;
    }
  }

  //create messages
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() message: Message,
  ): Promise<Message> {
    if (file) {
      const uploadedImage = await this.cloudinaryService.uploadImage(file);
      message.imageUrl = uploadedImage.secure_url;
    }
    return await this.messagesService.create(message);
  }

  //update messages
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() messages: Message,
  ): Promise<Message> {
    return this.messagesService.update(id, messages);
  }

  //delete messages
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if messages not found
    const messages = await this.messagesService.findOne(id);
    if (!messages) {
      throw new Error('Message not found');
    }
    return this.messagesService.delete(id);
  }
}
