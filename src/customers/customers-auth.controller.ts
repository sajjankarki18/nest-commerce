import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { StoreAuthService } from 'src/store-auth/store-auth.service';
import { SignupCustomerDto } from './dto/signup-customer.dto';
import { SigninCustomerDto } from './dto/signin-customer.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Customer Auth')
@Controller('/account/customers')
export class CustomerAuthController {
  constructor(private readonly storeAuthService: StoreAuthService) {}

  /* register new user */
  @Throttle(10, 60)
  @Post('/signup')
  @ApiOperation({ summary: 'Sign up a new customer' })
  @ApiBody({ type: SignupCustomerDto })
  @ApiResponse({ status: 201, description: 'Customer signed up successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  signup(@Body() signupCustomerDto: SignupCustomerDto) {
    return this.storeAuthService.signup(signupCustomerDto);
  }

  /* login user */
  @Throttle(5, 60)
  @Post('/signin')
  @ApiOperation({ summary: 'Sign in a customer' })
  @ApiBody({ type: SigninCustomerDto })
  @ApiResponse({ status: 200, description: 'Customer signed in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  signin(@Body() signinCustomerDto: SigninCustomerDto) {
    return this.storeAuthService.signin(signinCustomerDto);
  }

  /* get user-information */
  @Get('/me')
  @ApiOperation({ summary: 'Get current customer details' })
  @ApiResponse({
    status: 200,
    description: 'Customer details retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getUserDetails(@Req() req: { user: { userId: string } }) {
    const customerId: string = req.user?.userId;
    return this.storeAuthService.getUserDetails(customerId);
  }
}
