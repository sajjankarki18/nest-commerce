import { Body, Controller, Post } from '@nestjs/common';
import { StoreAuthService } from 'src/store-auth/store-auth.service';
import { SignupCustomerDto } from './dto/signup-customer.dto';
import { SigninCustomerDto } from './dto/signin-customer.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('/account/customers')
export class CustomerAuthController {
  constructor(private readonly storeAuthService: StoreAuthService) {}

  @Throttle(10, 60)
  @Post('/signup')
  signup(@Body() signupCustomerDto: SignupCustomerDto) {
    return this.storeAuthService.signup(signupCustomerDto);
  }

  @Throttle(5, 60)
  @Post('/signin')
  signin(@Body() signinCustomerDto: SigninCustomerDto) {
    return this.storeAuthService.signin(signinCustomerDto);
  }
}
