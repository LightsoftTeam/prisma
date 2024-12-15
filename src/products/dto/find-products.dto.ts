import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class FindProductsDto {
    @ApiProperty({
        description: 'The name or the code of the product',
        example: 'Product 1',
    })
    @IsString()
    @IsOptional()
    q?: string;
}