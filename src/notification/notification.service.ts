import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    usersRepository: usersRepository;
  }

  // Send noti to userId
  async sendToUser(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (
      user?.notificationToken &&
      Expo.isExpoPushToken(user.notificationToken)
    ) {
      const message = {
        to: user.notificationToken,
        title: 'A quick reminder',
        body: 'Check out our best recipes',
      };
      await expo.sendPushNotificationsAsync([message]);
    }
  }

  // Send noti to all users
  async sendToAll(): Promise<void> {
    const users = await this.usersRepository.find();
    const messages = [];
    for (const user of users) {
      if (
        user.notificationToken &&
        Expo.isExpoPushToken(user.notificationToken)
      ) {
        messages.push({
          to: user.notificationToken,
          title: 'A quick reminder',
          body: 'Check out our best recipes',
        });
      }
    }

    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    (async () => {
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }
}
