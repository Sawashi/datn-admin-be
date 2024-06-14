import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';

import { FeedBacks } from './feedbacks.entity';
import { CreateOrUpdateFeedbackDto } from './dto/feedbacks.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@ApiTags('feedbacks')
@Controller('feedbacks')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin, Role.User)
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {
    feedbacksService;
  }

  @Post()
  async createOrUpdateFeedback(
    @Body() dto: CreateOrUpdateFeedbackDto,
  ): Promise<FeedBacks> {
    return this.feedbacksService.createOrUpdateFeedback(dto);
  }
}
