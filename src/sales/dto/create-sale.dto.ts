import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { PaymentItem, PaymentMethod } from "src/domain/entities";

export class ItemDto{
    @ApiProperty({
        description: 'Product ID',
        example: 'f7b1f1b0-0b1b-4b7b-8b1b-0b1b1b1b1b1b'
    })
    @IsUUID()
    productId: string;
    @ApiProperty({
        description: 'Quantity',
        example: 1
    })
    @IsNumber()
    quantity: number;
    @ApiProperty({
        description: 'Price',
        example: 100
    })
    @IsNumber()
    salePrice: number;
}

export class PaymentItemDto{
    @ApiProperty({
        description: 'Payment method',
        example: PaymentMethod.CASH
    })
    @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;
    @ApiProperty({
        description: 'Amount',
        example: 100
    })
    @IsNumber()
    amount: number;
}

export class CreateSaleDto {
    @ApiProperty({
        description: 'Items',
    })
    @IsArray()
    @Type(() => ItemDto)
    @ValidateNested({
        each: true,
    })
    items: ItemDto[];

    @ApiProperty({
        description: 'Subsidiary ID',
        example: 'f7b1b3b0-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
    })
    @IsUUID()
    subsidiaryId: string;

    @ApiProperty({
        description: 'Total',
        example: 100
    })
    @IsNumber()
    total: number;

    @ApiProperty({
        description: 'Payment items',
    })
    @IsArray()
    @Type(() => PaymentItemDto)
    @ValidateNested({
        each: true,
    })
    paymentItems: PaymentItem[];

    @ApiProperty({
        description: 'Customer ID',
        example: 'f7b1f1b0-0b1b-4b7b-8b1b-0b1b1b1b1b1b'
    })
    @IsUUID()
    customerId: string;
}
