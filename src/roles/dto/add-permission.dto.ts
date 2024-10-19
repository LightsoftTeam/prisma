import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { Action, Module } from "src/domain/entities";

export class AddPermissionDto{
    @ApiProperty({
        description: 'The uuid of the permission',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsOptional()
    id?: string;
    @ApiProperty({
        description: 'Action name',
        example: Action.CREATE,
        enum: Action
    })
    @IsEnum(Action)
    action: Action;
    @ApiProperty({
        description: 'Module name',
        example: Module.DASHBOARD,
        enum: Module
    })
    @IsEnum(Module)
    module: Module;
}