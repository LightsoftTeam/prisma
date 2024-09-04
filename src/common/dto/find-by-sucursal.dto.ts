import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class FindBySubsidiaryDto {
    @ApiProperty({
        description: 'The subsidiary id of resources to filter',
        example: 'f7b9e3b0-4b7b-4b7b-8b7b-4b7b7b7b7b7b',
    })
    @IsUUID()
    subsidiaryId: string;
}
