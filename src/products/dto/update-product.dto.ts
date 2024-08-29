import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({
        description: 'The status of the product',
        example: true,
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;
}
