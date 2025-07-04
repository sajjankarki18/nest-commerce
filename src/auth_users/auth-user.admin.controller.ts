import { Body, Controller, Post } from '@nestjs/common';
import { AuthUserService } from './auth-user.service';
import { ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Autentication workflow')
@Controller('/admin/auth_user')
export class AuthUserAdminController {
  constructor(private readonly authUserService: AuthUserService) {}

  @Throttle(10, 60)
  @Post('/signup')
  signupUser(@Body() signupUserDto: SignupUserDto) {
    return this.authUserService.signupUser(signupUserDto);
  }

  @Throttle(5, 60)
  @Post('/signin')
  signinUser(@Body() siginUserDto: SigninUserDto) {
    return this.authUserService.signinUser(siginUserDto);
  }
}
