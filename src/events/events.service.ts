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
  ) {
    eventRepository: eventRepository;
    dishRepository: dishRepository;
    dishService: dishService;
    ingredientRepository: ingredientRepository;
    dishIngredientRepository: dishIngredientRepository;
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
}
