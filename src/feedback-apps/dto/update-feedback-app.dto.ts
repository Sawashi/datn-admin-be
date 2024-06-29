import { PartialType } from '@nestjs/swagger';
import { CreateFeedbackAppDto } from './create-feedback-app.dto';

export class UpdateFeedbackAppDto extends PartialType(CreateFeedbackAppDto) {}
