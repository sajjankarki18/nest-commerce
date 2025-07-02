import { Logger } from '@nestjs/common';
import { SignupCustomerDto } from 'src/customers/dto/signup-customer.dto';
import { CustomerRepository } from 'src/customers/repositories/customer.repository';
import { SigninCustomerDto } from 'src/customers/dto/signin-customer.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class StoreAuthService {
    private readonly customerRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(customerRepository: CustomerRepository, jwtService: JwtService, configService: ConfigService, logger: Logger);
    checkCustomerExists(signupCustomerDto: SignupCustomerDto): Promise<void>;
    signup(signupCustomerDto: SignupCustomerDto): Promise<import("../customers/entities/customer.entity").Customer>;
    signin(signinCustomerDto: SigninCustomerDto): Promise<{
        access_token: string;
    }>;
    jwtAccessToken(userId: string, email: string): Promise<{
        access_token: string;
    }>;
}
