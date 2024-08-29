import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class FindBrandsDto {
    @ApiProperty({
        description: 'The enterprise id to filter brands',
        example: 'f7b9e3b0-4b7b-4b7b-8b7b-4b7b7b7b7b7b',
    })
    @IsUUID()
    enterpriseId: string;
}
