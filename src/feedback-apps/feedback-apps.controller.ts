import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeedbackAppsService } from './feedback-apps.service';
import { CreateFeedbackAppDto } from './dto/create-feedback-app.dto';
import { UpdateFeedbackAppDto } from './dto/update-feedback-app.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('feedback-apps')
@ApiTags('Users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Roles(Role.Admin, Role.User)
export class FeedbackAppsController {
  constructor(private readonly feedbackAppsService: FeedbackAppsService) {
    feedbackAppsService;
  }

  @Post()
  create(
    @GetUser() loginUser: User,
    @Body() createFeedbackAppDto: CreateFeedbackAppDto,
  ) {
    return this.feedbackAppsService.create(loginUser, createFeedbackAppDto);
  }

  @Get()
  findAll() {
    return this.feedbackAppsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackAppsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedbackAppDto: UpdateFeedbackAppDto,
  ) {
    return this.feedbackAppsService.update(+id, updateFeedbackAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbackAppsService.remove(+id);
  }
}
