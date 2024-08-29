import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { CommonModule } from 'src/common/common.module';
import { EnterprisesService } from 'src/enterprises/enterprises.service';
import { SubsidiariesService } from 'src/subsidiaries/subsidiaries.service';
import { EnterprisesModule } from 'src/enterprises/enterprises.module';
import { SubsidiariesModule } from 'src/subsidiaries/subsidiaries.module';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, ConfigService, UsersService, EnterprisesService, SubsidiariesService],
  imports: [
    UsersModule,
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
    CommonModule,
    EnterprisesModule,
    SubsidiariesModule,
  ],
  exports: [
    JwtModule,
    JwtService,
    UsersService,
    EnterprisesService,
    SubsidiariesService,
  ]
})
export class AuthModule {}