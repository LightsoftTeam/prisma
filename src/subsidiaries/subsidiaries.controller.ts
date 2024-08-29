import { Controller } from '@nestjs/common';
import { SubsidiariesService } from './subsidiaries.service';

@Controller('subsidiaries')
export class SubsidiariesController {
  constructor(private readonly subsidiariesService: SubsidiariesService) {}
}
