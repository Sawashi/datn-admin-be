import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'src/users/user.entity';
import * as dotenv from 'dotenv';
import { UsersService } from 'src/users/users.service';
import { Collection } from 'src/collections/collection.entity';
import { Topic } from 'src/topics/topic.entity';
import { MealPlan } from 'src/mealplan/mealplan.entity';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User, Collection, Topic, MealPlan]),
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
