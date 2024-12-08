import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { GlosaType } from "src/domain/entities";

export class FindGlosasDto {
    @ApiProperty({
        description: 'Glosa type', 
        nullable: true,
        enum: GlosaType,
        example: GlosaType.INCOME 
    })
    @IsEnum(GlosaType)
    @IsOptional()
    type?: GlosaType;
}
