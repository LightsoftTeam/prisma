import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty({
        description: 'The status of the user',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @ApiProperty({
        description: 'The password of the user',
        example: 'password'
    })
    @IsOptional()
    password: string;
}