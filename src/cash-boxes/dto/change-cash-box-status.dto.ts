import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { CashBoxStatus } from "src/domain/entities";
import { ItemDto } from "./create-cash-box-movement.dto";
import { Type } from "class-transformer";

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

    @ApiProperty({
        description: 'Remarks of the movement',
        example: 'Opening the cash box',
        nullable: true
    })
    @IsString()
    @IsOptional()
    remarks?: string;
}
