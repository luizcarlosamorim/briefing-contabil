import { PartialType } from '@nestjs/mapped-types';
import { CreateBriefingDto } from './create-briefing.dto';

export class UpdateBriefingDto extends PartialType(CreateBriefingDto) {}
