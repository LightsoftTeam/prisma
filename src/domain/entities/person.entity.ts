import { CosmosDateTime, CosmosPartitionKey } from '@nestjs/azure-database';

export enum DocumentType {
    DNI = 'dni',
    PASAPORTE = 'pasaporte',
    CARNET_EXTRANJERIA = 'carnet_extranjeria',
    RUC = 'ruc',
}

export enum PersonType {
    NATURAL = 'natural',
    JURIDICA = 'juridica',
}

@CosmosPartitionKey('id')
export class Person {
    id?: string;
    givenNames: string;
    lastName: string;
    address: string;
    email: string;
    phone: string;
    districtId?: string;
    image?: string;
    type: PersonType;
    documentType?: DocumentType;
    documentNumber?: string;
    @CosmosDateTime() createdAt: Date;
    @CosmosDateTime() updatedAt?: Date;
}