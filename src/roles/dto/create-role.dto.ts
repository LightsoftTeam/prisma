import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { AddPermissionDto } from "./add-permission.dto";

export class CreateRoleDto{
    @ApiProperty({
        description: 'Role name',
        example: 'Admin',
    })
    @IsString()
    @IsNotEmpty()
    name: string;
    @ApiProperty({
        description: 'Items',
    })
    @IsArray()
    @IsOptional()
    @Type(() => AddPermissionDto)
    @ValidateNested({
        each: true,
    })
    permissions?: AddPermissionDto[];
}