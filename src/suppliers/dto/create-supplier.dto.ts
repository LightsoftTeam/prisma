import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateSupplierDto {
    @ApiProperty({
        description: 'The id of the person',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    personId: string;
    @ApiProperty({
        description: 'The id of the enterprise',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    enterpriseId: string;
}
