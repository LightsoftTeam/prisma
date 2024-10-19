import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateCashBoxDto {
    @ApiProperty({
        description: 'The name of the cash box',
        example: 'Caja 1'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The description of the cash box',
        example: 'The main cash box'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'The id of the user responsible for the cash box',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    responsableId: string;
}
