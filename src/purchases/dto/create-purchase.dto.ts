import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsUUID, ValidateNested } from "class-validator";
import { PaymentItemDto } from "src/movements/dto/payment-item.dto";

export class PurchaseItemDto{
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
    purchasePrice: number;
}

export class CreatePurchaseDto {
    @ApiProperty({
        description: 'Items',
    })
    @IsArray()
    @Type(() => PurchaseItemDto)
    @ValidateNested({
        each: true,
    })
    items: PurchaseItemDto[];

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
    paymentItems: PaymentItemDto[];

    @ApiProperty({
        description: 'Supplier ID',
        example: 'f7b1f1b0-0b1b-4b7b-8b1b-0b1b1b1b1b1b'
    })
    @IsUUID()
    supplierId: string;

    @ApiProperty({
        description: 'Generate cash flow',
        example: true
    })
    @IsBoolean()
    generateCashFlow: boolean;
}
