import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Dish } from 'src/dish/dish.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { DishService } from 'src/dish/dish.service';
import { DishDto } from 'src/dish/dto/dishDto.dto';
import { Ingredient } from 'src/ingredient/ingredient.entity';
import { DishIngredient } from 'src/dish/dish_ingredient.entity';

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

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { eventName, startTime, endTime, reward, dishes } = createEventDto;

    const event = this.eventRepository.create({
      eventName,
      startTime,
      endTime,
      reward,
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
    return this.eventRepository.find({ relations: ['dishes'] });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['dishes'],
    });

    if (!event) {
      throw new NotFoundException(`Not found event with ID ${id}`);
    }

    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
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
  ): Promise<Event> {
    const { ingredients } = dishDto;
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['dishes'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const dish = this.dishRepository.create({
      cookingTime: dishDto.cookingTime,
      dishName: dishDto.dishName,
      imageUrl: imageUrl,
      servings: dishDto.servings,
      calories: dishDto.calories,
      author: dishDto.author,
      directions: dishDto.directions,
    });

    const ingredientPromises = ingredients.map(async (ingredientDto) => {
      const existingIngredient = await this.ingredientRepository.findOne({
        where: {
          ingredientName: ILike(ingredientDto.ingredientName),
        },
      });

      if (!existingIngredient) {
        const newIngredient = this.ingredientRepository.create({
          ingredientName: ingredientDto.ingredientName,
          imageUrl: ingredientDto.imageUrl,
          description: ingredientDto.description,
        });

        await this.ingredientRepository.save(newIngredient);

        return {
          ingredient: newIngredient,
          mass: ingredientDto.mass,
        };
      } else {
        return {
          ingredient: existingIngredient,
          mass: ingredientDto.mass,
        };
      }
    });

    const resolvedIngredients = await Promise.all(ingredientPromises);

    const dishIngredientPromises = resolvedIngredients.map(
      ({ ingredient, mass }) => {
        const dishIngredient = this.dishIngredientRepository.create({
          dish: dish,
          ingredient,
          mass,
        });

        return this.dishIngredientRepository.save(dishIngredient);
      },
    );

    await Promise.all(dishIngredientPromises);

    const newDish = await this.dishRepository.findOne({
      where: { id: dish.id },
      relations: ['dishToIngredients', 'dishToIngredients.ingredient'],
    });

    if (!newDish) {
      throw new HttpException('Failed to create dish', HttpStatus.BAD_REQUEST);
    }

    event.dishes.push(newDish);
    return this.eventRepository.save(event);
  }
}
