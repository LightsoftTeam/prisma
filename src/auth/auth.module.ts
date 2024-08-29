import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { EnterprisesRepository, PeopleRepository, SubsidiariesRepository, UsersRepository } from 'src/domain/repositories';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService, UsersService, UsersRepository, EnterprisesRepository, SubsidiariesRepository, PeopleRepository],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '300s' },
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [
    JwtModule,
    JwtService,
  ]
})
export class AuthModule {}