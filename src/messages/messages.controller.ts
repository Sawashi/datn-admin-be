import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {
    this.messagesService = messagesService;
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
  async create(@Body() messages: Message): Promise<Message> {
    return await this.messagesService.create(messages);
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
