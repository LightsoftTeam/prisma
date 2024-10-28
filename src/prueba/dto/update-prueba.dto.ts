import { PartialType } from '@nestjs/swagger';
import { CreatePruebaDto } from './create-prueba.dto';

export class UpdatePruebaDto extends PartialType(CreatePruebaDto) {}
