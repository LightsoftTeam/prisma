import { BadRequestException, Injectable } from '@nestjs/common';
import { BrandsRepository } from './domain/repositories';

@Injectable()
export class AppService {

  constructor(
    private readonly brandsRepository: BrandsRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async verifyUser(email?: string){
    if(!email){
      throw new BadRequestException({
        "version": "1.0.0",
        "status": 400,
        "userMessage": "El usuario no existe",
      })
    }
    if(!email.includes('joseluis')){
      throw new BadRequestException({
        "version": "1.0.0",
        "status": 400,
        "userMessage": `El usuario ${email} no existe`,
      })
    }
    return {
      id: Math.floor(Math.random() * 100),
      givenName: 'Jose Luis',
      familyName: 'Martinez',
      email,
    }
  }
}
