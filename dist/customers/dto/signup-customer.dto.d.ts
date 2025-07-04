import { StatusEnumType } from 'src/enums/StatusType.enum';
export declare class SignupCustomerDto {
    username: string;
    email: string;
    password: string;
    confirm_password: string;
    phone_number: string;
    status: StatusEnumType;
}
