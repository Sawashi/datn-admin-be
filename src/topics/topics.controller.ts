import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TopicsService } from './topics.service';
import { Topic } from './topic.entity';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Topics')
@Controller('topics')
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
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Topic> {
    const topics = await this.topicsService.findOne(id);
    if (!topics) {
      throw new Error('Topic not found');
    } else {
      return topics;
    }
  }

  //create topics
  @Post()
  async create(@Body() topics: Topic): Promise<Topic> {
    return await this.topicsService.create(topics);
  }

  //update topics
  @Put(':id')
  async update(@Param('id') id: number, @Body() topics: Topic): Promise<Topic> {
    return this.topicsService.update(id, topics);
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
}
