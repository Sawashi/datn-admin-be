import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CollectionDto {
  @ApiProperty()
  @IsString()
  name: string;
}
