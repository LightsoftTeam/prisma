import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateCustomerDto {
    @ApiProperty({
        description: 'Enterprise id',
        example: '123e4567-s89b-12d3-a456-426614174000'
    })
    @IsUUID()
    enterpriseId: string;

    @ApiProperty({
        description: 'Person id',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    personId: string;
}
