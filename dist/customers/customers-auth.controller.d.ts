import { StoreAuthService } from 'src/store-auth/store-auth.service';
import { SignupCustomerDto } from './dto/signup-customer.dto';
import { SigninCustomerDto } from './dto/signin-customer.dto';
export declare class CustomerAuthController {
    private readonly storeAuthService;
    constructor(storeAuthService: StoreAuthService);
    signup(signupCustomerDto: SignupCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    signin(signinCustomerDto: SigninCustomerDto): Promise<{
        access_token: string;
    }>;
}
