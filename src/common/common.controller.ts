import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Common')
@Controller('common')
export class CommonController {
    constructor() {}
}
