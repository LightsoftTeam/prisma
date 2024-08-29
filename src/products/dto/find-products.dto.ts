import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class FindProductsDto {
    @ApiProperty({
        description: 'The enterprise id to filter products',
        example: 'f7b9e3b0-4b7b-4b7b-8b7b-4b7b7b7b7b7b',
    })
    @IsUUID()
    enterpriseId: string;
}
