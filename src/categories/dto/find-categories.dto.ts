import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class FindCategoriesDto {
    @ApiProperty({
        description: 'The id of the enterprise',
        example: 'DA23F4A3-4F3A-4F3A-4F3A-4F3A4F3A4F3A',
    })
    @IsString()
    @IsNotEmpty()
    enterpriseId: string;
}
