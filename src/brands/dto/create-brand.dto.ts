import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({
        description: 'The name of the brand',
        example: 'Nike',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The enterprise id of the brand',
        example: 'f7b1b3b0-1b1b-4b1b-8b1b-1b1b1b1b1b1b',
    })
    @IsNotEmpty()
    @IsUUID()
    enterpriseId: string;

    @ApiProperty({
        description: 'The description of the brand',
        example: 'Just do it',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The image of the brand',
        example: 'https://example.com/image.jpg',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    image?: string;
}
