import { User } from "src/domain/entities";
import { Enterprise } from "src/domain/entities/enterprise.entity";
import { Subsidiary } from "src/domain/entities/subsidiary.entity";

export interface LoginResponse {
    user: Partial<User>;
    enterprise: Partial<Enterprise>;
    subsidiary: Partial<Subsidiary>;
    token: string;
}