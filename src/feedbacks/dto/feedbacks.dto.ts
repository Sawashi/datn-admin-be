import { ApiProperty } from '@nestjs/swagger';

export class CreateOrUpdateFeedbackDto {
  @ApiProperty()
  likePoint: number;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userid: number;
}
