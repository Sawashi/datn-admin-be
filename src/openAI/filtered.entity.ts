import { ApiProperty } from '@nestjs/swagger';
import { Dish } from 'src/dish/dish.entity';
import { Column, Entity } from 'typeorm';

@Entity('filteredResult')
export class FilteredResult {
  @ApiProperty()
  @Column()
  existedInDatabase: boolean;
  @ApiProperty()
  @Column({ nullable: true })
  dishList: Dish[];
}
