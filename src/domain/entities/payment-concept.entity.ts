import { CashFlowType } from "./cash-box.entity";

export interface PaymentConcept {
    id: string;
    name: string;
    type: CashFlowType;
    description?: string;
}