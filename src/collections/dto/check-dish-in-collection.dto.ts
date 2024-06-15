import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckDishInCollectionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collectionName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  dishId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
