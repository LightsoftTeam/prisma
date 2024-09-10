import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { CashFlowType } from "src/domain/entities";

export class ItemDto{
    @ApiProperty({
        description: 'Amount of the item',
        example: 200
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'Price',
        example: 100
    })
    @IsString()
    @IsOptional()
    remarks?: string;    
}

export class CreateCashBoxMovementDto{
    @ApiProperty({
        description: 'Type of cash flow',
        example: CashFlowType.INCOME,
        enum: CashFlowType
    })
    @IsEnum(CashFlowType)
    type: CashFlowType;

    @ApiProperty({
        description: 'Payment concept id',
        example: 'f7b1f1b0-0b1b-4b7b-8b1b-0b1b1b1b1b1b'
    })
    @IsUUID()
    paymentConceptId: string;

    @ApiProperty({
        description: 'Remarks of the movement',
        example: 'Payment of the sale'
    })
    remarks?: string;

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
        description: 'Total',
        example: 100
    })
    @IsNumber()
    total: number;
}