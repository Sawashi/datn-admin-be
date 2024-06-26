import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Record } from 'src/record/record.entity';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Roles(Role.Admin, Role.User)
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
  @Get(':id')
  async findOne(
    @Param('id') id: number,
    @GetUser() loginUser: User,
  ): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (
      loginUser.role === Role.User &&
      loginUser.id.toString() !== id.toString()
    ) {
      throw new ForbiddenException();
    }
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
