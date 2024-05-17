import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Record } from 'src/record/record.entity';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    usersService: usersService;
  }

  //get all users
  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findall();
  }
  @ApiOperation({
    summary: 'Get user',
    description: 'Get user by id',
  })
  //get one user
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('User not found');
    } else {
      return user;
    }
  }

  //get record user
  @Get(':id/records')
  async findRecordByUserId(@Param('id') id: number): Promise<Record[]> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('Topic not found');
    } else {
      return user.records;
    }
  }

  //create user
  @Post()
  async create(@Body() user: User): Promise<User> {
    return await this.usersService.create(user);
  }

  //update user
  @Put(':id')
  async update(@Param('id') id: number, @Body() user: User): Promise<User> {
    return this.usersService.update(id, user);
  }
  //change user status
  @Put(':id/status')
  async changeStatus(
    @Param('id') id: number,
    @Body('status') status: string,
  ): Promise<User> {
    return this.usersService.changeStatus(id, status);
  }

  //delete user
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if user not found
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.usersService.delete(id);
  }
}
