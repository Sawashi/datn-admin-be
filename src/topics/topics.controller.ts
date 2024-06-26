import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { Topic } from './topic.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Message } from 'src/messages/message.entity';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { TopicUpdateDto } from './dto/topic-update.dto';
@ApiTags('Topics')
@Controller('topics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Roles(Role.Admin, Role.User)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {
    this.topicsService = topicsService;
  }

  //get all topics
  @ApiOkResponse({
    description: 'All topics records',
    type: Topic,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<Topic[]> {
    return await this.topicsService.findall();
  }
  //get one topics
  @ApiOkResponse({
    description: 'Record of a single topic',
    type: Topic,
    isArray: false,
  })
  @Get('user/:id')
  async getTopicByUserId(@Param('id') id: number) {
    return this.topicsService.getTopicByUserId(id);
  }

  @Get('user/:id/date-filter')
  async getTopicByDateRanges(@Param('id') id: number) {
    return this.topicsService.getTopicByDateRanges(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Topic> {
    const topics = await this.topicsService.findOne(id);
    if (!topics) {
      throw new Error('Topic not found');
    } else {
      return topics;
    }
  }

  @Get(':id/messages')
  async findMessagesByTopicId(@Param('id') id: number): Promise<Message[]> {
    const topics = await this.topicsService.findOne(id);
    if (!topics) {
      throw new Error('Topic not found');
    } else {
      return topics.messageList;
    }
  }

  //create topics
  @Post()
  async create(@Body() topics: Topic): Promise<Topic> {
    return await this.topicsService.create(topics);
  }

  //update topics
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() topicUpdateDto: TopicUpdateDto,
  ): Promise<Topic> {
    return this.topicsService.update(id, topicUpdateDto);
  }

  //delete topics
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if topics not found
    const topics = await this.topicsService.findOne(id);
    if (!topics) {
      throw new Error('Topic not found');
    }
    return this.topicsService.delete(id);
  }

  @Delete(':id/messages')
  async deleteAllMessagesInTopic(@Param('id') id: number): Promise<void> {
    return this.topicsService.deleteAllMessage(id);
  }
}
