import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginResponse } from './types/login-response';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { User } from 'src/users/entities/user.entity';
import { EnterprisesService } from 'src/enterprises/enterprises.service';
import { SubsidiariesService } from 'src/subsidiaries/subsidiaries.service';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly enterprisesService: EnterprisesService,
    private readonly subsidiariesService: SubsidiariesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: ApplicationLoggerService,
  ) { }

  async signIn({ username, password: passwordPayload }: SignInDto): Promise<LoginResponse> {
    this.logger.log(`sign in user ${username}`);
    try {
      const user = await this.usersService.getByUsername(username);
      if (!user || !user.isActive || user.deletedAt) {
        throw new UnauthorizedException();
      }
      const isPasswordValid = await bcrypt.compare(
        passwordPayload,
        user.password,
      );
      this.logger.log(`password valid ${isPasswordValid}`);
      if (!isPasswordValid) {
        throw new UnauthorizedException();
      }
      const token = this.generateToken(user);
      const [ filledUser, subsidiary ] = await Promise.all([
        this.usersService.fillUser({ user }),
        this.subsidiariesService.getById(user.subsidiaryId),
      ]);
      this.logger.log(`subsidary ${JSON.stringify(subsidiary)}`);
      this.logger.log(`enterprise ${JSON.stringify(subsidiary.enterpriseId)}`);
      const enterprise = await this.enterprisesService.getById(subsidiary.enterpriseId);
      return {
        user: filledUser,
        enterprise: FormatCosmosItem.cleanDocument(enterprise),
        subsidiary: FormatCosmosItem.cleanDocument(subsidiary),
        token,
      };
    } catch (error) {
      this.logger.error(error.message)
      throw error;
    }
  }

  async getAuthenticatedUser(req: any) {
    try {
      const user = req['loggedUser'];
      const token = this.generateToken(user);
      return {
        user,
        token,
      };
    } catch (error) {
      this.logger.error(`Error getting authenticated user: ${error.message}`);
      throw error;
    }
  }

  generateToken(user: Partial<User>): string {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
