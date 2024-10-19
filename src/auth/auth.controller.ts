import { Controller, Get, Post, Body, HttpCode, HttpStatus, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard, LoggedUser } from './guards/auth.guard';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Auth')
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/auth')
@UseInterceptors(GeneralInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @ApiResponse({
    status: 200,
    description: 'Login successful.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Retrieve authenticated user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @UseGuards(AuthGuard)
  @Get('authenticate')
  async getAuthenticatedUser(@Request() req: LoggedUser) {
    return this.authService.getAuthenticatedUser(req);
  }
}
