import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: 'The name of the category',
        example: 'Category 1',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The enterprise id',
        example: 'DA23F4A3-4F3A-4F3A-4F3A-4F3A4F3A4F3A',
    })
    @IsString()
    @IsNotEmpty()
    enterpriseId: string;

    @ApiProperty({
        description: 'The parent category id',
        example: 'DA23F4A3-4F3A-4F3A-4F3A-4F3A4F3A4F3A',
    })
    @IsString()
    @IsOptional()
    parentId?: string;
}
