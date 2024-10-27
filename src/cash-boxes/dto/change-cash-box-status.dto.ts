import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CashBoxStatus } from "src/domain/entities";
import { Type } from "class-transformer";
import { PaymentItemDto } from "src/movements/dto/payment-item.dto";

export class ChangeCashBoxStatusDto {
    @ApiProperty({
        description: 'The new status of the cash box',
        example: CashBoxStatus.OPEN,
        enum: CashBoxStatus
    })
    @IsEnum(CashBoxStatus)
    status: CashBoxStatus;

    @ApiProperty({
        description: 'Items',
    })
    @IsArray()
    @Type(() => PaymentItemDto)
    @ValidateNested({
        each: true,
    })
    items: PaymentItemDto[];

    @ApiProperty({
        description: 'Total',
        example: 100
    })
    @IsNumber()
    total: number;

    @ApiProperty({
        description: 'Remarks of the movement',
        example: 'Opening the cash box',
        nullable: true
    })
    @IsString()
    @IsOptional()
    remarks?: string;
}
