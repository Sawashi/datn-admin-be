import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/auth/role.enum';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/users/user.entity';
import { CreateReportReviewDto } from './dto/create-report-review.dto';
import { ReportReviewsService } from './report-reviews.service';

@ApiTags('report-reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Roles(Role.Admin, Role.User)
@Controller('report-reviews')
export class ReportReviewsController {
  constructor(private readonly reportReviewsService: ReportReviewsService) {
    reportReviewsService: reportReviewsService;
  }

  @Post()
  create(
    @GetUser() loginUser: User,
    @Body() createReportReviewDto: CreateReportReviewDto,
  ) {
    return this.reportReviewsService.create(loginUser, createReportReviewDto);
  }

  @Get()
  findAll() {
    return this.reportReviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportReviewsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateReportReviewDto: UpdateReportReviewDto,
  // ) {
  //   return this.reportReviewsService.update(+id, updateReportReviewDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportReviewsService.remove(+id);
  }
}
