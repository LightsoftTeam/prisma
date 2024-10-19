import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Action, Module } from "src/domain/entities";

export class AddPermissionDto{
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