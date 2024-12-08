import { Injectable } from '@nestjs/common';
import { TransactionDocumentsRepository } from '../domain/repositories/transaction-document.repository';

@Injectable()
export class TransactionDocumentsService {

  constructor(
    private readonly transactionDocumentsRepository: TransactionDocumentsRepository
  ) {}

  findAll() {
    return this.transactionDocumentsRepository.findAll();
  }
}
