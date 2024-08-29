import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DocumentType, PersonType } from "../entities/person.entity";

export class CreatePersonDto {
    @ApiProperty({
        description: 'The given names of the person',
        example: 'Jhon',
    })
    @IsString()
    @IsNotEmpty()
    givenNames: string;

    @ApiProperty({
        description: 'The last name of the person',
        example: 'Doe',
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        description: 'The address of the person',
        example: 'Av. Lima 123',
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'The email of the person',
        example: 'jhon@gmail.com',
    })
    @IsString()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'The phone of the person',
        example: '987654321',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'The image of the person',
        example: 'https://example.com/image.jpg',
        nullable: true,
    })
    @IsOptional()
    image?: string;

    @ApiProperty({
        description: 'The type of the person',
        example: PersonType.NATURAL,
    })
    @IsEnum(PersonType)
    type: PersonType;

    @ApiProperty({
        description: 'The document type of the person',
        example: DocumentType.DNI,
    })
    @IsEnum(DocumentType)
    documentType: DocumentType;

    @ApiProperty({
        description: 'The document number of the person',
        example: '12345678',
    })
    @IsString()
    documentNumber: string;
}