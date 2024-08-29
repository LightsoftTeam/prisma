import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class FindByEnterpriseDto {
    @ApiProperty({
        description: 'The enterprise id of resources to filter',
        example: 'f7b9e3b0-4b7b-4b7b-8b7b-4b7b7b7b7b7b',
    })
    @IsUUID()
    enterpriseId: string;
}
