import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: 'The name of the product',
        example: 'Product 1',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The enterprise id',
        example: 'DA23F4A3-4F3A-4F3A-4F3A-4F3A4F3A4F3A',
    })
    @IsUUID()
    enterpriseId: string;

    @ApiProperty({
        description: 'The code of the product',
        example: 'P001',
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        description: 'The purchase price of the product',
        example: 100,
    })
    @IsNumber()
    @IsNotEmpty()
    purchasePrice: number;

    @ApiProperty({
        description: 'The sale price of the product',
        example: 150,
    })
    @IsNumber()
    @IsNotEmpty()
    salePrice: number;

    @ApiProperty({
        description: 'The unit id of the product',
        example: 'DA23F4A3-4F3A-4F3A-4F3A-4F3A4F3A4F3A',
    })
    @IsUUID()
    unitId: string;

    @ApiProperty({
        description: 'The category id of the product',
        example: 'DA23F4A3-4F3A-4F3A-4F3A-4F3A4F3A4F3A',
    })
    @IsUUID()
    categoryId: string;

    @ApiProperty({
        description: 'The brand id of the product',
        example: 'DA23F4A3-4F3A-4F3A-4F3A-4F3A4F3A4F3A',
    })
    @IsUUID()
    @IsOptional()
    brandId: string;

    @ApiProperty({
        description: 'The image of the product',
        example: 'https://image.jpg',
    })
    @IsString()
    @IsOptional()
    image: string;
}