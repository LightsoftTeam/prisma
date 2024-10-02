import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsObject, IsUUID, ValidateNested } from "class-validator";
import { CreatePersonDto } from "src/people/dto/create-person.dto";

export class CreateCustomerDto {
    @ApiProperty({
        description: 'Enterprise id',
        example: '123e4567-s89b-12d3-a456-426614174000'
    })
    @IsUUID()
    enterpriseId: string;

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
