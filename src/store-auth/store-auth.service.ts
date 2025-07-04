import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupCustomerDto } from 'src/customers/dto/signup-customer.dto';
import { CustomerRepository } from 'src/customers/repositories/customer.repository';
import * as argon from 'argon2';
import { SigninCustomerDto } from 'src/customers/dto/signin-customer.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StoreAuthService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}
  async checkCustomerExists(signupCustomerDto: SignupCustomerDto) {
    const customer = await this.customerRepository.findOne({
      where: {
        email: signupCustomerDto.email,
      },
    });

    if (customer) {
      throw new ConflictException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['customer with this email already exists!'],
        error: 'Conflict',
      });
    }
  }
  async signup(signupCustomerDto: SignupCustomerDto) {
    await this.checkCustomerExists(signupCustomerDto);
    const hashedPassword = await argon.hash(signupCustomerDto?.password);

    /* validate the confirm password and actual password */
    if (signupCustomerDto?.password !== signupCustomerDto.confirm_password) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Passwords does not match, please try again later!'],
        error: 'Bad Request',
      });
    }
    try {
      const customer = this.customerRepository.create({
        username: signupCustomerDto.username,
        email: signupCustomerDto.email,
        password: hashedPassword,
        phone_number: signupCustomerDto.phone_number,
        status: signupCustomerDto.status,
      });

      return await this.customerRepository.save(customer);
    } catch (error) {
      this.logger.warn('Invalid password, please try again later', error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new account, please try again later!',
        ],
        error: 'Not Found',
      });
    }
  }

  async signin(signinCustomerDto: SigninCustomerDto) {
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

    return await this.jwtAccessToken(customerEmail.id, customerEmail.email);
  }

  /* generate a new access-token when user logs in */
  async jwtAccessToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
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
}
