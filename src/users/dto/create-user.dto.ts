import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsObject, IsString, min, MinLength, ValidateNested } from "class-validator";
import { CreatePersonDto } from "src/people/dto/create-person.dto";
import { ObligatoryRoleName } from "src/domain/entities/role.entity";

export class CreateUserDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'jhondoe1'
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password'
    })
    @IsString()
    @MinLength(4)
    password: string;

    @ApiProperty({
        description: 'The subsidiary id of the user',
        example: 'f7b1b3b0-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
    })
    @IsString()
    @IsNotEmpty()
    subsidiaryId: string;

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
        description: 'The role of the user',
        example: 'admin',
    })
    @IsString()
    @IsNotEmpty()
    roleId: string;
}