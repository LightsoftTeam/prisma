import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsObject, IsUUID, ValidateNested } from "class-validator";
import { CreatePersonDto } from "src/people/dto/create-person.dto";

export class CreateSupplierDto {
    @ApiProperty({
        description: 'The person data of the user',
    })
    @IsObject()
    @Type(() => CreatePersonDto)
    @ValidateNested({
        each: true,
    })
    person: CreatePersonDto;

    @ApiProperty({
        description: 'The id of the enterprise',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    enterpriseId: string;
}
