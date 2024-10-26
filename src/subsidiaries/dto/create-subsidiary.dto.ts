import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSubsidiaryDto {
    @ApiProperty({
        description: 'Subsidiary name',
        example: 'Subsidiary 1',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Subsidiary address',
        example: 'Av. 1',
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'Subsidiary RUC',
        example: '12345678901',
    })
    @IsString()
    @IsNotEmpty()
    ruc: string;

    @ApiProperty({
        description: 'Subsidiary image',
        example: 'https://www.example.com/image.jpg',
    })
    @IsOptional()
    image?: string;

    @ApiProperty({
        description: 'Subsidiary email',
        example: 'subsidiary1@test.com'
    })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty({
        description: 'Subsidiary phone',
        example: '123456789'
    })
    @IsString()
    @IsOptional()
    phone?: string;
}
