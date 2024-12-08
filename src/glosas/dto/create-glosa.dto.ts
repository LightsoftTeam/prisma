import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { GlosaType } from "src/domain/entities";

export class CreateGlosaDto {
    @ApiProperty({
        description: 'The name of the glosa',
        example: 'Glosa 1',
    })
    @IsString()
    name: string;
    
    @ApiProperty({
        description: 'The glosa type',
        example: GlosaType.INCOME,
        enum: GlosaType,
    })
    @IsEnum(GlosaType)
    type: GlosaType;
    
    @ApiProperty({
        description: 'The name of the glosa',
        example: 'Glosa 1',
        nullable: true,
    })
    @IsString()
    @IsOptional()
    description: string;
}
