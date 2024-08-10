import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/dish/dish.entity';
import { DishService } from 'src/dish/dish.service';
import { DishIngredient } from 'src/dish/dish_ingredient.entity';
import { DishDto } from 'src/dish/dto/dishDto.dto';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { User } from 'src/users/user.entity';
import { In, Repository } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
    private readonly dishService: DishService,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,

    @InjectRepository(DishIngredient)
    private readonly dishIngredientRepository: Repository<DishIngredient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    eventRepository: eventRepository;
    dishRepository: dishRepository;
    dishService: dishService;
    ingredientRepository: ingredientRepository;
    dishIngredientRepository: dishIngredientRepository;
    userRepository: userRepository;
  }

  async create(
    createEventDto: CreateEventDto,
    imageUrl: string,
  ): Promise<Event> {
    const { eventName, startTime, endTime, reward, dishes } = createEventDto;

    const event = this.eventRepository.create({
      eventName,
      startTime,
      endTime,
      reward,
      imageUrl,
    });

    if (dishes && dishes.length > 0) {
      const dishEntities = await this.dishRepository.find({
        where: { id: In(dishes) },
      });
      event.dishes = dishEntities;
    }

    return this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: {
        dishes: {
          reviews: true,
          notes: true,
          collections: true,
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });
  }

  async findAllWithoutDishes(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        dishes: {
          notes: true,
          reviews: true,
          collections: true,
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Not found event with ID ${id}`);
    }

    return event;
  }

  async update(
    id: number,
    updateEventDto: UpdateEventDto,
    imageUrl: string,
  ): Promise<Event> {
    const { eventName, startTime, endTime, reward, dishes } = updateEventDto;

    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['dishes'],
    });

    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }

    event.eventName = eventName ?? event.eventName;
    event.startTime = startTime ?? event.startTime;
    event.endTime = endTime ?? event.endTime;
    event.reward = reward ?? event.reward;
    event.imageUrl = imageUrl ?? event.imageUrl;

    if (dishes && dishes.length > 0) {
      const dishEntities = await this.dishRepository.find({
        where: { id: In(dishes) },
      });

      event.dishes = dishEntities;
    } else {
      event.dishes = [];
    }

    return this.eventRepository.save(event);
  }

  async remove(id: number): Promise<void> {
    await this.eventRepository.delete(id);
  }

  async addDishToEvent(
    eventId: number,
    dishDto: DishDto,
    imageUrl: string,
    loginUser: User,
  ): Promise<Event> {
    const newDishDto = {
      ...dishDto,
      author: loginUser.username,
    };
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['dishes'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const existingDish = event.dishes.find(
      (dish) => dish.author === loginUser.username,
    );

    if (existingDish) {
      throw new HttpException(
        'You have already registered this dish for the event',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newDish = await this.dishService.create(newDishDto, imageUrl);

    if (!newDish) {
      throw new HttpException('Failed to create dish', HttpStatus.BAD_REQUEST);
    }

    event.dishes.push(newDish);
    return this.eventRepository.save(event);
  }

  async getEventRanking(
    id: number,
  ): Promise<
    { dish: Dish; filteredCollectionsCount: number; userImage: string | null }[]
  > {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: {
        dishes: {
          notes: true,
          reviews: true,
          collections: true,
          dishToIngredients: {
            ingredient: true,
          },
        },
      },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const topDishes = await this.getTopRankedDishes(event.dishes);

    const result = await Promise.all(
      topDishes.map(async ({ dish, filteredCollectionsCount }) => {
        const user = await this.userRepository.findOne({
          where: {
            username: dish.author,
          },
        });
        return {
          dish,
          filteredCollectionsCount,
          userImage: user?.imgUrl || null,
        };
      }),
    );

    return result;
  }

  private async getTopRankedDishes(
    dishes: Dish[],
  ): Promise<{ dish: Dish; filteredCollectionsCount: number }[]> {
    const dishesWithFilteredCollections = await Promise.all(
      dishes.map(async (dish) => {
        // Lấy danh sách các collection và user liên quan
        const filteredCollections = await Promise.all(
          dish.collections.map(async (collection) => {
            const user = await this.userRepository.findOne({
              where: { id: collection.userId },
            });
            return user && user.username !== dish.author ? collection : null;
          }),
        );

        const validCollections = filteredCollections.filter(Boolean);

        return {
          dish,
          filteredCollectionsCount: validCollections.length,
        };
      }),
    );

    // Sắp xếp theo filteredCollectionsCount, sau đó theo rating, cuối cùng theo thời gian cập nhật
    return dishesWithFilteredCollections
      .sort((a, b) => {
        // Sắp xếp theo filteredCollectionsCount (số lượt thích)
        if (b.filteredCollectionsCount !== a.filteredCollectionsCount) {
          return b.filteredCollectionsCount - a.filteredCollectionsCount;
        }

        // Nếu trùng filteredCollectionsCount, sắp xếp theo rating trung bình
        const aRating =
          a.dish.reviews.reduce((sum, review) => sum + review.rating, 0) /
          a.dish.reviews.length;
        const bRating =
          b.dish.reviews.reduce((sum, review) => sum + review.rating, 0) /
          b.dish.reviews.length;

        if (bRating !== aRating) {
          return bRating - aRating;
        }

        // Nếu trùng rating, sắp xếp theo thời gian cập nhật (lấy timestamp mới nhất)
        const aLatestUpdate = Math.max(
          new Date(a.dish.updatedAt).getTime(),
          ...a.dish.collections.map((collection) =>
            new Date(collection.updatedAt).getTime(),
          ),
        );

        const bLatestUpdate = Math.max(
          new Date(b.dish.updatedAt).getTime(),
          ...b.dish.collections.map((collection) =>
            new Date(collection.updatedAt).getTime(),
          ),
        );

        return bLatestUpdate - aLatestUpdate;
      })
      .slice(0, 3);
  }
}
