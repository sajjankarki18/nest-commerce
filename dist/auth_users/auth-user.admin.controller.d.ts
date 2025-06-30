import { AuthUserService } from './auth-user.service';
import { SignupUserDto } from './dto/signin-user.dto';
import { SigninUserDto } from './dto/signup-user.dto';
export declare class AuthUserAdminController {
    private readonly authUserService;
    constructor(authUserService: AuthUserService);
    signupUser(signupUserDto: SignupUserDto): Promise<import("./entites/auth-user.entity").AuthUser>;
    signinUser(siginUserDto: SigninUserDto): Promise<{
        access_token: string;
    }>;
}
