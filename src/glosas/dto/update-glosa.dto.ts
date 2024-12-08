import { PartialType } from '@nestjs/swagger';
import { CreateGlosaDto } from './create-glosa.dto';

export class UpdateGlosaDto extends PartialType(CreateGlosaDto) {}
