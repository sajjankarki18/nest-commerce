import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class AuthUser {
    id: string;
    username: string;
    email: string;
    password: string;
    phone_number: number;
    status: StatusEnumType;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
