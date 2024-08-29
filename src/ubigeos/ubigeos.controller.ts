import { Controller } from '@nestjs/common';
import { UbigeosService } from './ubigeos.service';

@Controller('ubigeos')
export class UbigeosController {
  constructor(private readonly ubigeosService: UbigeosService) {}
}
