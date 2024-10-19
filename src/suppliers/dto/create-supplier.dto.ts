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
}
