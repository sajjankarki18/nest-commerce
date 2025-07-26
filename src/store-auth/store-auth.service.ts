import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupCustomerDto } from 'src/customers/dto/signup-customer.dto';
import { CustomerRepository } from 'src/customers/repositories/customer.repository';
import * as argon from 'argon2';
import { SigninCustomerDto } from 'src/customers/dto/signin-customer.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthProviderTypes } from 'src/enums/auth-providerType.enum';

@Injectable()
export class StoreAuthService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  /* helper function to check if the customer exists (dont allow to create duplicate customer with same email) */
  async checkCustomerExists(signupCustomerDto: SignupCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: {
        email: signupCustomerDto.email,
      },
    });

    if (customer) {
      this.logger.warn('Customer with this email already exists.');
      throw new ConflictException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['customer with this email already exists!'],
        error: 'Conflict',
      });
    }
  }

  /* helper function to confirm password */
  confirmPassword(signupCustomerDto: SignupCustomerDto) {
    /* validate the confirm password and actual password */
    if (signupCustomerDto?.password !== signupCustomerDto.confirm_password) {
      this.logger.warn('Passwords does not match, please try again later.');
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Passwords does not match, please try again later!'],
        error: 'Bad Request',
      });
    }
  }

  /* register a new user */
  async signup(
    signupCustomerDto: SignupCustomerDto,
  ): Promise<{ message: string }> {
    /* validate if customer with this email already exists */
    await this.checkCustomerExists(signupCustomerDto);
    /* hash password using argon-hasing-algorithm */
    const hashedPassword = await argon.hash(signupCustomerDto?.password);
    /* helper function to confirm password */
    this.confirmPassword(signupCustomerDto);
    try {
      const customer = this.customerRepository.create({
        username: signupCustomerDto.username,
        email: signupCustomerDto.email,
        password: hashedPassword,
        phone_number: signupCustomerDto.phone_number,
        status: signupCustomerDto.status,
      });

      const savedCustomer = await this.customerRepository.save(customer);

      /* if user registerd their account with email, then update the auth_provider_type as email */
      await this.customerRepository.update(
        { id: savedCustomer.id },
        {
          auth_provider_type: AuthProviderTypes.Email,
        },
      );

      this.logger.log('User has been registered successfully.');
      return {
        message: 'Customer has been registered successfully',
      };
    } catch (error) {
      this.logger.error('Invalid password, please try again later', error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new account, please try again later!',
        ],
        error: 'Not Found',
      });
    }
  }

  /* login user */
  async signin(
    signinCustomerDto: SigninCustomerDto,
  ): Promise<{ access_token: string }> {
    const customerEmail = await this.customerRepository.findOne({
      where: {
        email: signinCustomerDto.email,
      },
    });

    if (!customerEmail) {
      this.logger.warn('Invalid email, please try again later');
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['Invalid email, please try again later!'],
        error: 'Not Found',
      });
    }

    const passVerify = await argon.verify(
      customerEmail?.password,
      signinCustomerDto?.password,
    );
    if (!passVerify) {
      this.logger.warn('Invalid password, please try again later');
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['Invalid password, please try again later!'],
        error: 'Unauthorized',
      });
    }

    this.logger.log('Customer has been signed in successfully.');
    return await this.jwtAccessToken(customerEmail.id, customerEmail.email);
  }

  /* generate a new access-token when user logs in */
  async jwtAccessToken(
    userId: string,
    email: string,
  ): Promise<{ message: string; access_token: string }> {
    try {
      const payload = {
        userId: userId,
        email,
      };

      const access_token = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('CUSTOMER_JWT_SECRET'),
      });

      return {
        message: 'Customer has been signed in successfully.',
        access_token: access_token,
      };
    } catch (error) {
      this.logger.error('some error occurred, while signing in', error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while signing in, please try again later',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* fetch logged in user-information */
  async getUserDetails(customerId: string) {
    const customerInfo = await this.customerRepository.findOne({
      where: {
        id: customerId,
      },
    });

    if (!customerInfo) {
      this.logger.warn('User details has been expired or does not exists.');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['User detail has been expired or does not exists'],
        error: 'Not Found',
      });
    }

    return {
      id: customerInfo?.id,
      first_name: customerInfo?.username,
      email: customerInfo?.email,
      aut_provider_type: customerInfo?.auth_provider_type,
    };
  }
}
