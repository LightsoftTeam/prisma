import { BadRequestException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { REQUEST } from '@nestjs/core';
import { Person } from 'src/domain/entities/person.entity';
import { ObligatoryRoleName } from 'src/domain/entities/role.entity';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { FindUsersDto } from './dto/find-users.dto';
import { UsersRepository } from 'src/domain/repositories/users.repository';
import { PeopleRepository } from 'src/domain/repositories/people.repository';

const PASSWORD_SALT_ROUNDS = 10;

@Injectable({ scope: Scope.REQUEST })
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: ApplicationLoggerService,
    @Inject(REQUEST) private request: Request,
    private readonly peopleRepository: PeopleRepository,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findAll(findUsersDto: FindUsersDto) {
    const { subsidiaryId } = findUsersDto;
    this.logger.log('findAll users');
    const users = await this.usersRepository.findBySubsidiaryId(subsidiaryId);
    return Promise.all(users.map(user => this.fillUser({ user })));
  }

  async findOne(id: string) {
    this.logger.log(`find user by id ${id}`);
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.fillUser({ user });
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      this.logger.log(`create user ${createUserDto}`);
      //TODO: comprobe permissions instead of role
      this.revokeWhenIsNotAdmin();
      const { person: personDto, ...userDto } = createUserDto;
      const { username, password } = userDto;
      const existingUser = await this.getByUsername(username);
      if (existingUser) {
        throw new BadRequestException(ERRORS[ERROR_CODES.USER_ALREADY_EXISTS]);
      }
      const hashedPassword = bcrypt.hashSync(password, PASSWORD_SALT_ROUNDS);
      //TODO: check if person is already created
      const person = await this.peopleRepository.create({...personDto, createdAt: new Date()});
      const user: User = {
        ...userDto,
        password: hashedPassword,
        personId: person.id,
        isActive: true,
        createdAt: new Date(),
      };
      const newUser = await this.usersRepository.create(user);
      const filledUser = await this.fillUser({ user: newUser, person });
      return filledUser;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`update user ${updateUserDto}`);
    const loggedUser = this.getLoggedUser();
    //TODO: comprobe permissions instead of role
    // if (loggedUser.id !== id && loggedUser.roleName !== ObligatoryRoleName.ADMIN) {
    //   throw new UnauthorizedException('Unauthorized');
    // }
    const user = await this.usersRepository.findById(id);
    if(!user){
      throw new NotFoundException('User not found');
    }
    const { person: personDto, password, ...newUserDto } = updateUserDto;
    this.logger.log(`personDto ${JSON.stringify(personDto)}`);
    this.logger.log(`newUserDto ${JSON.stringify(newUserDto)}`);
    const updatePayload: User = {
      ...user,
      ...newUserDto,
    };
    if (password) {
      updatePayload.password = bcrypt.hashSync(updateUserDto.password, PASSWORD_SALT_ROUNDS);
    }
    if (personDto) {
      this.logger.log(`updating person ${JSON.stringify(personDto)}`);
      await this.peopleRepository.update(user.personId, personDto);
    }
    this.logger.log(`updated user: ${JSON.stringify(updatePayload)}`);
    const updatedUser = await this.usersRepository.update(id, updatePayload);
    return this.fillUser({ user: updatedUser });
  }

  async remove(id: string) {
    try {
      this.revokeWhenIsNotAdmin();
      await this.usersRepository.delete(id);
      return null;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  getLoggedUser() {
    this.logger.log('getting logged user');
    const loggedUser = this.request['loggedUser'] as User;
    if (!loggedUser) {
      throw new UnauthorizedException('Not logged in.');
    }
    return loggedUser;
  }

  async fillUser({ user, person }: { user: User, person?: Person }): Promise<Partial<User>> {
    this.logger.log(`filling user - person: ${!!person} - user: ${!!user}`);
    if (!person) {
      const { personId } = user;
      person = await this.peopleRepository.findById(personId);
    }
    const filledUser = {
      ...user,
      person: FormatCosmosItem.cleanDocument(person) as Person,
    };
    return FormatCosmosItem.cleanDocument(filledUser, ['password']);
  }

  revokeWhenIsNotAdmin() {
    const loggedUser = this.getLoggedUser();
    //TODO: comprobe permissions instead of role
    // if (!loggedUser || loggedUser.roleName !== ObligatoryRoleName.ADMIN) {
    //   throw new UnauthorizedException('Unauthorized');
    // }
  }
}
