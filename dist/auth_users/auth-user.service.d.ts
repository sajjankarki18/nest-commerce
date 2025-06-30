import { Logger } from '@nestjs/common';
import { AuthUser } from './entites/auth-user.entity';
import { AuthUserRepository } from './repositories/auth-user.repository';
import { SignupUserDto } from './dto/signin-user.dto';
import { SigninUserDto } from './dto/signup-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthUserService {
    private readonly logger;
    private readonly authUserRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(logger: Logger, authUserRepository: AuthUserRepository, jwtService: JwtService, configService: ConfigService);
    validateUserEmail(signupUserDto: SignupUserDto): Promise<void>;
    signupUser(signinUserDto: SignupUserDto): Promise<AuthUser>;
    signinUser(signinUserDto: SigninUserDto): Promise<{
        access_token: string;
    }>;
    jwtAccessToken(userId: string, email: string): Promise<{
        access_token: string;
    }>;
}
