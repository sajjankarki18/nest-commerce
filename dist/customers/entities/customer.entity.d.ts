import { AuthProviderTypes } from 'src/enums/auth-providerType.enum';
import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class Customer {
    id: string;
    username: string;
    email: string;
    password: string;
    phone_number: string;
    status: StatusEnumType;
    auth_provider_type: AuthProviderTypes;
    auth_provider_id: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
