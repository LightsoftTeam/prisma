import { ApiProperty } from '@nestjs/swagger';
import { UpdatePersonDto } from 'src/people/dto/update-person.dto';
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSupplierDto {
    @ApiProperty({
        description: 'The person data of the user',
    })
    @IsObject()
    @Type(() => UpdatePersonDto)
    @ValidateNested({
        each: true,
    })
    person: UpdatePersonDto;
}
