import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'cajero1'
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password'
  })
  @IsString()
  password: string;
}