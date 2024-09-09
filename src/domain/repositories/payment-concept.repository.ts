import { Injectable } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/common/services/application-logger.service';
import { CashFlowType, PaymentConcept } from '../entities';

const PAYMENT_CONCEPTS: PaymentConcept[] = [
    {
        "id": "023e934f-12bd-4ba4-8c03-bea5b0854a09",
        "name": "Apertura de caja",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "64140673-c9ec-46e4-afe8-65991c711fa0",
        "name": "Cierre de caja",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "ceb6dfc3-50aa-41e2-a402-3c461c8bcb95",
        "name": "Pago de cliente",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "65111ddf-d6b5-4c0e-ac18-f84cd5c3fc94",
        "name": "Pago a proveedor",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "244ef9b5-9ff4-4a1f-9a56-455abe38248b",
        "name": "Anulación de venta",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "9f65ebe5-6545-43fa-9782-d4e4978173be",
        "name": "Anulación de compra",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "82aceb59-2160-4c77-9e4f-a8ce17f17fcd",
        "name": "Pago a planilla",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "051b7cf4-517a-4583-85a2-5ea940fe6072",
        "name": "Para compra de dólares",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "fc8cf7c0-a1e7-4442-a9c4-109dc401559e",
        "name": "Por compra de dólares",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "1d1692d6-f519-43a2-8c1f-469d8938cf15",
        "name": "Ajuste de tipo de cambio",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "83092b13-94f8-4d79-9905-48660db01a87",
        "name": "Ajuste de tipo de cambio",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "5d7c97fc-0388-454e-87d0-37615d901047",
        "name": "Préstamo",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "e7137e6a-fa33-4085-9b6d-ed937f9f5e33",
        "name": "Devolución de préstamo",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "0e941b41-5e14-4182-8169-87b8b93f2545",
        "name": "Préstamo",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "7f2f31da-e934-4798-a469-b1e6ecf1affa",
        "name": "Devolución de préstamo",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "fecc07bb-367e-4ab3-88ce-6d4d1ab515bd",
        "name": "Depósito",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "2d3ee6a4-41d1-4242-9ee5-3de8edcebf10",
        "name": "Monto por asignación de caja chica",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "def67496-b065-43b9-8554-67a82b077c27",
        "name": "Asignar monto de caja",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "993fea30-6b0e-49bc-a036-e95a314d9daa",
        "name": "Otros MovementType.INCOMEs",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "08b751c1-e79a-4bf4-addf-35c138cbafcf",
        "name": "Otros MovementType.OUTCOMEs",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "6cb11284-07e2-4881-a01c-6f24d519565e",
        "name": "Fondo de caja",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "03405cf7-c9d7-4992-854c-cecfecf4dcb6",
        "name": "Gasto operativo",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "cd6cfdd4-26f1-4cdb-afe9-eb4a3874548e",
        "name": "Pago a proveedor de servicios",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "4c5411b2-8070-42d6-9cbf-73666f4f8101",
        "name": "Movilidad y pasajes",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "5b4892a6-7a09-4e07-ad63-5e6da4fa3ce3",
        "name": "Producto para venta",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "b8d2705c-8bf8-4abb-a6e1-7bcb6079ef66",
        "name": "Propina de mozo",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "f8f5c59b-94b3-4e85-9a13-8d5b4af26288",
        "name": "Pago adelantado",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "9e87c06d-4787-4c89-8289-458a5ab544b7",
        "name": "Para pago a proveedores",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "c155f436-62c6-45ca-8ea6-84c48951954b",
        "name": "Desembolso por retención",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "4a5bb443-ecb0-47ee-a597-2af0743c410e",
        "name": "Impuestos",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "966443ba-c676-4171-b5c6-13da0048b1ba",
        "name": "Pago de venta al crédito",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "2202887c-1bf6-42ba-842d-e9704abc5e7d",
        "name": "Compras",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "231e495a-0979-48be-9dbd-e4e9c2971d16",
        "name": "Adelanto de personal",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "43ab7d00-36f6-41bd-a25e-8cca26b97fe7",
        "name": "Mantenimiento",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "2881e6fb-5050-4c73-b927-7f7b4cd32945",
        "name": "Pago a planilla de cocina",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "8077dadf-7961-4d5c-9a6f-fd0076bc3557",
        "name": "Devolución de pago anticipado",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "da8f4098-a590-4811-8896-ac9ae0c4281e",
        "name": "Pago de horas extra",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "ebcc78ea-efa7-4757-85bb-c0012bc74bf8",
        "name": "Pago a proveedor de insumos",
        "type": CashFlowType.OUTCOME,
    },
    {
        "id": "f1ed6c69-4dc8-48d8-86ff-f27eb61ccadd",
        "name": "Pago de cuenta por cobrar",
        "type": CashFlowType.INCOME,
    },
    {
        "id": "cf18d4e4-9315-4ac0-97f2-d779511c1903",
        "name": "Pago de cuenta por pagar",
        "type": CashFlowType.OUTCOME,
    },
]

@Injectable()
export class PaymentConceptsRepository {

    constructor(
        private readonly logger: ApplicationLoggerService,
    ) {
        this.logger.setContext(PaymentConceptsRepository.name);
    }

    findAll({
        movementType
    }: {
        movementType?: CashFlowType;
    }) {
        if(movementType) {
            return PAYMENT_CONCEPTS.filter(concept => concept.type === movementType);
        }
        return PAYMENT_CONCEPTS;
    }

    findById(id: string) {
        return PAYMENT_CONCEPTS.find(concept => concept.id === id);
    }

    findByIds(ids: string[]) {
        return PAYMENT_CONCEPTS.filter(concept => ids.includes(concept.id));
    }
}