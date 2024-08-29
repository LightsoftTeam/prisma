import { BadRequestException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/azure-database';
import { FormatCosmosItem } from 'src/common/helpers/format-cosmos-item.helper';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { REQUEST } from '@nestjs/core';
import { Person } from 'src/people/entities/person.entity';
import { PeopleService } from 'src/people/people.service';
import { RoleName } from 'src/roles/entities/role.entity';
import { ERROR_CODES, ERRORS } from 'src/common/constants/errors.constants';
import { FindUsersDto } from './dto/find-users.dto';

const PASSWORD_SALT_ROUNDS = 10;

@Injectable({ scope: Scope.REQUEST })
export class UsersService {

  constructor(
    @InjectModel(User)
    private readonly usersContainer: Container,
    private readonly logger: ApplicationLoggerService,
    @Inject(REQUEST) private request: Request,
    private readonly peopleService: PeopleService,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findAll(findUsersDto: FindUsersDto) {
    const { subsidiaryId } = findUsersDto;
    this.logger.log('findAll users');
    const querySpec = {
      query: 'SELECT * FROM c where c.subsidiaryId = @subsidiaryId AND NOT IS_DEFINED(c.deletedAt) ORDER BY c.createdAt DESC',
      parameters: [
        {
          name: '@subsidiaryId',
          value: subsidiaryId
        }
      ],
    };
    const { resources } = await this.usersContainer.items.query<User>(querySpec).fetchAll();
    return Promise.all(resources.map(user => this.fillUser({ user })));
  }

  async findOne(id: string) {
    this.logger.log(`find user by id ${id}`);
    const user = await this.getById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.fillUser({ user });
  }

  async getById(id: string): Promise<User | null> {
    try {
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [
          {
            name: '@id',
            value: id,
          },
        ],
      };
      const { resources } = await this.usersContainer.items.query<User>(querySpec).fetchAll();
      return resources.at(0) ?? null;
    } catch (error) {
      this.logger.error(`error getting user by id ${error.message}`);
      return null;
    }
  }

  async getByIds(ids: string[]) {
    const querySpec = {
      query: 'SELECT c.id, c.name, c.image FROM c WHERE ARRAY_CONTAINS(@ids, c.id)',
      parameters: [
        {
          name: '@ids',
          value: ids,
        },
      ],
    };
    const { resources } = await this.usersContainer.items.query<User>(querySpec).fetchAll();
    return resources;
  }

  async getByUsername(username: string): Promise<User | null> {
    const querySpec = {
      query: 'SELECT * FROM c WHERE c.username = @username',
      parameters: [
        {
          name: '@username',
          value: username,
        },
      ],
    };
    const { resources } = await this.usersContainer.items.query<User>(querySpec).fetchAll();
    if (resources.length === 0) {
      return null;
    }
    return resources[0];
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
      const person = await this.peopleService.create(personDto);
      const user: User = {
        ...userDto,
        password: hashedPassword,
        personId: person.id,
        isActive: true,
        createdAt: new Date(),
      };
      const { resource } = await this.usersContainer.items.create<User>(user);
      const filledUser = await this.fillUser({ user: resource, person });
      return filledUser;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    this.logger.log(`update user ${updateUserDto}`);
    const loggedUser = this.getLoggedUser();
    if (loggedUser.id !== id && loggedUser.roleName !== RoleName.ADMIN) {
      throw new UnauthorizedException('Unauthorized');
    }
    const user = await this.getById(id);//throw not found exception if not found
    if(!user){
      throw new NotFoundException('User not found');
    }
    const { person: personDto, password, ...newUserDto } = updateUserDto;
    this.logger.log(`personDto ${JSON.stringify(personDto)}`);
    this.logger.log(`newUserDto ${JSON.stringify(newUserDto)}`);
    const updatedUser: User = {
      ...user,
      ...newUserDto,
    };
    if (password) {
      updatedUser.password = bcrypt.hashSync(updateUserDto.password, PASSWORD_SALT_ROUNDS);
    }
    if (personDto) {
      this.logger.log(`updating person ${JSON.stringify(personDto)}`);
      await this.peopleService.update(user.personId, personDto);
    }
    this.logger.log(`updated user: ${JSON.stringify(updatedUser)}`);
    const { resource } = await this.usersContainer.item(user.id, user.id).replace<User>(updatedUser);
    return this.fillUser({ user: resource });
  }

  async remove(id: string) {
    try {
      this.revokeWhenIsNotAdmin();
      const user = await this.findOne(id);//throw not found exception if not found
      const deletedUser = {
        ...user,
        deletedAt: new Date(),
      };
      await this.usersContainer.item(user.id).replace(deletedUser);
      return null;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  getLoggedUser() {
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
      person = await this.peopleService.getById(personId);
    }
    const filledUser = {
      ...user,
      person: FormatCosmosItem.cleanDocument(person) as Person,
    };
    return FormatCosmosItem.cleanDocument(filledUser, ['password']);
  }

  // isAdmin() {
  //   const loggedUser = this.getLoggedUser();
  //   return loggedUser.role === Role.ADMIN;
  // }

  revokeWhenIsNotAdmin() {
    const loggedUser = this.getLoggedUser();
    if (!loggedUser || loggedUser.roleName !== RoleName.ADMIN) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
