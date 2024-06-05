import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/auth/role.enum';
import { NotificationService } from './notification.service';
@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
@Roles(Role.Admin)
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {
    notificationsService: notificationsService;
  }

  @Post('sentTo/:id')
  async sentToUser(@Param('id') id: number): Promise<void> {
    await this.notificationsService.sendToUser(id);
  }

  @Post('sentToAll')
  async sentToAll(): Promise<void> {
    await this.notificationsService.sendToAll();
  }
}
