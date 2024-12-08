import { Injectable } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { TransactionDocument } from '../entities/transaction-document.entity';

const TRANSACTION_DOCUMENTS: TransactionDocument[] = [
    {
        id: '7768759d-7ea1-40be-9322-bc44851eaa66',
        name: 'Arqueo de caja'
    },
    {
        id: '9176ca7d-79ac-4a7f-a4fa-663326b33dad',
        name: 'Boleta'
    },
    {
        id: '16b0693a-4c37-4f09-a8e2-6f228b8c7f46',
        name: 'Boleto transporte'
    },
    {
        id: '105861d8-7ada-4871-8d2c-bff60ca971bf',
        name: 'Contratos'
    },
    {
        id: '14da173b-6041-4e9b-a926-9e0bc8c50d2d',
        name: 'Cotizacion'
    },
    {
        id: 'abd53e9f-cb1b-4e80-ab98-e3eb99069946',
        name: 'V factura'
    },
    {
        id: '9f8880d0-2c4c-40db-b66e-513b1e8520ff',
        name: 'Guia de remision'
    },
    {
        id: 'ade5dca6-0f05-486c-8616-5b6bb9ac1a4c',
        name: 'Movimientos de caja'
    },
    {
        id: 'f462f7eb-922c-4c2e-b253-5f54c3a11aff',
        name: 'Nota de crédito boleta'
    },
    {
        id: 'ea7905a2-e9bf-47dc-b8e6-e39704e0f66d',
        name: 'Nota de crédito factura'
    },
    {
        id: '80f1176f-a537-49be-ae1f-7e3f7c5c051c',
        name: 'Nota de debito boleta'
    },
    {
        id: '06f9aa24-f40d-457b-b3ae-f4f343def397',
        name: 'Nota de debito factura'
    },
    {
        id: '1c3f7792-772c-4cdb-8a0e-9bbe99cdffa9',
        name: 'Nota de ingreso'
    },
    {
        id: '00035eeb-e3a7-4ee7-b9c2-c9a7038f17b0',
        name: 'Nota de salida'
    },
    {
        id: '9dfb37c2-116e-4c7d-99b3-bfdd7e7c4a88',
        name: 'Nota venta'
    },
    {
        id: 'f29877f2-a3f5-49a0-9f08-d0fab0d8ac53',
        name: 'Otros'
    },
    {
        id: 'f634fd9c-b25b-456c-8195-5585cb39d802',
        name: 'Pedidos'
    },
    {
        id: '33abcf32-3075-4efb-945f-2861faf24c66',
        name: 'Recibo por arrendamiento'
    },
    {
        id: '42d65b14-28d1-489c-913c-4bb4237c5e55',
        name: 'Recibo por honorarios'
    },
    {
        id: '8bf719c7-731a-4c74-8a06-3fa9f43f2bee',
        name: 'Recibo por servicios publicos'
    },
    {
        id: '99691b20-c2dc-4061-9420-ae07fcba092b',
        name: 'Ticket'
    }
];

@Injectable()
export class TransactionDocumentsRepository {

    constructor(
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(TransactionDocumentsRepository.name);
    }

    findAll() {
        return TRANSACTION_DOCUMENTS;
    }

    findById(id: string) {
        return TRANSACTION_DOCUMENTS.find(td => td.id === id);
    }

    findByIds(ids: string[]) {
        return TRANSACTION_DOCUMENTS.filter(td => ids.includes(td.id));
    }
}