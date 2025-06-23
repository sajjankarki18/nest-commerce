import { Body, Controller, Post } from "@nestjs/common";
import { AuthUserService } from "./auth-user.service";
import { ApiTags } from "@nestjs/swagger";
import { SignupUserDto } from "./dto/signup-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";

@ApiTags("Autentication workflow")
@Controller("/admin/auth_user")
export class AuthUserAdminController {
  constructor(private readonly authUserService: AuthUserService) {}

  /* create a new user */
  @Post("/signup")
  signupUser(@Body() signupUserDto: SignupUserDto) {
    return this.authUserService.signupUser(signupUserDto);
  }

  /* sign-in to existing user */
  @Post("/signin")
  signinUser(@Body() siginUserDto: SigninUserDto) {
    return this.authUserService.signinUser(siginUserDto);
  }
}
