import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TransactionDocumentsService } from './transaction-documents.service';
import { ApiTags } from '@nestjs/swagger';
import { GeneralInterceptor } from 'src/common/interceptors/general.interceptor';

@ApiTags('Transaction Documents')
@UseInterceptors(GeneralInterceptor)
@Controller('enterprises/:enterpriseId/subsidiaries/:subsidiaryId/transaction-documents')
export class TransactionDocumentsController {
  constructor(private readonly transactionDocumentsService: TransactionDocumentsService) {}

  @Get()
  findAll() {
    return this.transactionDocumentsService.findAll();
  }
}
