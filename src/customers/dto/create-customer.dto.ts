import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsObject, ValidateNested } from "class-validator";
import { CreatePersonDto } from "src/people/dto/create-person.dto";

export class CreateCustomerDto {
    @ApiProperty({
        description: 'The person data of the user',
    })
    @IsObject()
    @Type(() => CreatePersonDto)
    @ValidateNested({
        each: true,
    })
    person: CreatePersonDto;
}
