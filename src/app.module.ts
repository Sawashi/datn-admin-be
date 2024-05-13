import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RecipesModule } from './recipes/recipes.module';
import { CategoriesModule } from './categories/categories.module';
import { CuisinesModule } from './cuisines/cuisines.module';
import { ReportsModule } from './reports/reports.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';
import { DishModule } from './dish/dish.module';
import { TopicsModule } from './topics/topics.module';
import { MessagesModule } from './messages/messages.module';
import { IngredientModule } from './ingredient/ingredient.module';
import { NotesModule } from './notes/notes.module';
import { AllergiesModule } from './allergies/allergies.module';
import { DietsModule } from './diets/diets.module';
import { DislikedModule } from './disliked/disliked.module';
import { PersonalizeModule } from './personalize/personalize.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CollectionModule } from './collections/collection.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => ({
        type: process.env.DB_TYPE as any, // Change the value of the type property to "mysql"
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true, // Keep synchronize to automatically update the database schema
      }),
      inject: [ConfigService],
    }),
    RecipesModule,
    CategoriesModule,
    CuisinesModule,
    ReportsModule,
    ReviewsModule,
    AuthModule,
    ScheduleModule,
    DishModule,
    TopicsModule,
    MessagesModule,
    IngredientModule,
    NotesModule,
    AllergiesModule,
    DietsModule,
    DislikedModule,
    PersonalizeModule,
    CloudinaryModule,
    CollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
