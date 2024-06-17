import { Injectable } from '@nestjs/common';
import { Record } from './record.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Allergies } from 'src/allergies/allergies.entity';
import { Diets } from 'src/diets/diets.entity';
import { Cuisine } from 'src/cuisines/cuisine.entity';
import { User } from 'src/users/user.entity';
import { RecordCreateDto } from './dto/record-create.dto';
import { RecordUpdateDto } from './dto/record-update.dto';

@Injectable()
export class RecordService {
  constructor(
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Allergies)
    private allergyRepository: Repository<Allergies>,
    @InjectRepository(Diets)
    private dietRepository: Repository<Diets>,
    @InjectRepository(Cuisine)
    private cuisineRepository: Repository<Cuisine>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    recordRepository: recordRepository;
    allergyRepository: allergyRepository;
    dietRepository: dietRepository;
    cuisineRepository: cuisineRepository;
    userRepository: userRepository;
  }

  // get all Record
  async findAll(): Promise<Record[]> {
    return await this.recordRepository.find({
      relations: {
        user: true,
        allergies: true,
        diets: true,
        cuisines: true,
      },
    });
  }

  // get one Record
  async findOne(id: number): Promise<Record> {
    return await this.recordRepository.findOne({
      where: { id },
      relations: {
        user: true,
        allergies: true,
        diets: true,
        cuisines: true,
      },
    });
  }

  //create Record
  async create(recordCreateDto: RecordCreateDto): Promise<Record> {
    const { userId, allergies, diets, cuisines } = recordCreateDto;
    // const allergyEntities = await this.allergyRepository.findByIds(allergies);
    // const dietEntities = await this.dietRepository.findByIds(diets);
    // const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);
    const newRecord = this.recordRepository.create({
      nameRecord: recordCreateDto.nameRecord,
      meal: recordCreateDto.meal ? recordCreateDto.meal : 0,
      money: recordCreateDto.money ? recordCreateDto.money : 0,
      numberOfDiners: recordCreateDto.numberOfDiners,
      typeSuggest: recordCreateDto.typeSuggest
        ? recordCreateDto.typeSuggest
        : 0,
    });

    if (userId) {
      const userEntity = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (userEntity) newRecord.user = userEntity;
      else {
        throw new Error('User not found');
      }
    }
    if (allergies) {
      const allergyEntities = await this.allergyRepository.findByIds(allergies);
      if (allergyEntities.length === allergies.length)
        newRecord.allergies = allergyEntities;
      else {
        throw new Error('Allergies not found');
      }
    }
    if (diets) {
      const dietEntities = await this.dietRepository.findByIds(diets);
      if (dietEntities.length === diets.length) newRecord.diets = dietEntities;
      else {
        throw new Error('Diets not found');
      }
    }
    if (cuisines) {
      const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);
      if (cuisineEntities.length === cuisines.length)
        newRecord.cuisines = cuisineEntities;
      else {
        throw new Error('Cuisines not found');
      }
    }

    return await this.recordRepository.save(newRecord);
  }

  // update Record
  async update(id: number, recordUpdateDto: RecordUpdateDto): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new Error('Record not found');
    }

    const { allergies, diets, cuisines, ...otherProps } = recordUpdateDto;

    if (allergies) {
      const allergyEntities = await this.allergyRepository.findByIds(allergies);
      if (allergyEntities.length === allergies.length)
        record.allergies = allergyEntities;
      else {
        throw new Error('Allergies not found');
      }
    }
    if (diets) {
      const dietEntities = await this.dietRepository.findByIds(diets);
      if (dietEntities.length === diets.length) record.diets = dietEntities;
      else {
        throw new Error('Diets not found');
      }
    }
    if (cuisines) {
      const cuisineEntities = await this.cuisineRepository.findByIds(cuisines);
      if (cuisineEntities.length === cuisines.length)
        record.cuisines = cuisineEntities;
      else {
        throw new Error('Cuisines not found');
      }
    }

    Object.assign(record, otherProps);
    return this.recordRepository.save(record);
  }

  // delete Record
  async delete(id: number): Promise<void> {
    await this.recordRepository.delete(id);
  }
}
