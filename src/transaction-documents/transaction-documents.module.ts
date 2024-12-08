import { Module } from '@nestjs/common';
import { TransactionDocumentsService } from './transaction-documents.service';
import { TransactionDocumentsController } from './transaction-documents.controller';

@Module({
  controllers: [TransactionDocumentsController],
  providers: [TransactionDocumentsService],
})
export class TransactionDocumentsModule {}
