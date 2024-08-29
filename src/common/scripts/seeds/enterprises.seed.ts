import { Enterprise } from "src/domain/entities/enterprise.entity";

export function getEnterprises(){
    const enterprises: Enterprise[] = [
        {
            address: 'Av. Javier Prado Este 1234',
            name: 'Empresa 1',
            phone: '123456789',
            ruc: '123456789',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            address: 'Calle Los Pinos 123',
            name: 'Empresa 2',
            phone: '987654321',
            ruc: '987654321',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            address: 'Av. Los Alamos 321',
            name: 'Empresa 3',
            phone: '456789123',
            ruc: '456789123',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
    return enterprises;
}