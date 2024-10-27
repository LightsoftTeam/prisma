import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentMethod } from "src/domain/entities";

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
    @ApiProperty({
        description: 'Remarks',
        example: 'Payment in cash'
    })
    @IsString()
    @IsOptional()
    remarks: string;
}