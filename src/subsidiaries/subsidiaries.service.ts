import { Injectable } from '@nestjs/common';
import type { Container } from '@azure/cosmos';
import { CreateSubsidiaryDto } from './dto/create-subsidiary.dto';
import { UpdateSubsidiaryDto } from './dto/update-subsidiary.dto';
import { InjectModel } from '@nestjs/azure-database';
import { Subsidiary } from './entities/subsidiary.entity';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';

@Injectable()
export class SubsidiariesService {

  constructor(
    private readonly logger: ApplicationLoggerService,
    @InjectModel(Subsidiary)
    private readonly subsidiariesContainer: Container,
  ) {}

  create(createSubsidiaryDto: CreateSubsidiaryDto) {
    return 'This action adds a new subsidiary';
  }

  findAll() {
    return `This action returns all subsidiaries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subsidiary`;
  }

  async getById(id: string) {
    try {
      this.logger.log(`Getting subsidiary by id: ${id}`);
      const querySpec = {
        query: 'SELECT * FROM c WHERE c.id = @id',
        parameters: [
          {
            name: '@id',
            value: id,
          },
        ],
      };
      const { resources } = await this.subsidiariesContainer.items.query<Subsidiary>(querySpec).fetchAll();
      return resources.at(0) ?? null;
    } catch (error) {
      return null;
    }
  }

  update(id: number, updateSubsidiaryDto: UpdateSubsidiaryDto) {
    return `This action updates a #${id} subsidiary`;
  }

  remove(id: number) {
    return `This action removes a #${id} subsidiary`;
  }
}
