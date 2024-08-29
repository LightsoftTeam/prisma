import { Enterprise } from "src/enterprises/entities/enterprise.entity";
import { Subsidiary } from "src/subsidiaries/entities/subsidiary.entity";
import { User } from "src/users/entities/user.entity";

export interface LoginResponse {
    user: Partial<User>;
    enterprise: Partial<Enterprise>;
    subsidiary: Partial<Subsidiary>;
    token: string;
}