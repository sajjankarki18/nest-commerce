import {
  BadRequestException,
  Body,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from './entites/auth-user.entity';
import { AuthUserRepository } from './repositories/auth-user.repository';
import * as argon from 'argon2';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(AuthUser)
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /* validate the email, check if the email arelady exists */
  async validateUserEmail(signupUserDto: SignupUserDto): Promise<void> {
    const userEmail = await this.authUserRepository.exists({
      where: {
        email: signupUserDto.email.trim().toLowerCase(),
      },
    });

    /* if the email exists already in the database,
    then do not allow the user to create a new account */
    if (userEmail) {
      this.logger.warn('email is aleady in use');
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['Failed to register user. Email is already in use.'],
        error: 'BadRequest',
      });
    }
  }

  confirmPassword(signupUserDto: SignupUserDto): void {
    if (signupUserDto.password !== signupUserDto.confirm_password) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['Passwords does not match, please try again later!'],
        error: 'Unauthorized',
      });
    }
  }

  /* create a new user */
  async signupUser(signinUserDto: SignupUserDto) {
    await this.validateUserEmail(signinUserDto);
    this.confirmPassword(signinUserDto);
    try {
      /* hash the user password before creating it */
      const hashedPassword = await argon.hash(signinUserDto.password);
      const user = this.authUserRepository.create({
        first_name: signinUserDto.first_name,
        last_name: signinUserDto.last_name,
        email: signinUserDto.email.trim().toLowerCase(),
        password: hashedPassword,
        phone_number: signinUserDto.phone_number,
        status: signinUserDto.status,
      });

      this.logger.log('the user has beem created successfully');
      const savedUser = await this.authUserRepository.save(user);
      return {
        message: 'User has been registered successfully.',
        user: {
          id: savedUser.id,
          first_name: savedUser.first_name,
          last_name: savedUser.last_name,
          email: savedUser.email,
        },
      };
    } catch (error) {
      this.logger.error(`some error occurred while creating a new user`, error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['some error occurred while creating a new user'],
        error: 'Internal Server Error',
      });
    }
  }

  /* log in into the existing user */
  async signinUser(
    signinUserDto: SigninUserDto,
  ): Promise<{ access_token: string }> {
    /* check user's email exists */
    const userEmail = await this.authUserRepository.findOne({
      where: {
        email: signinUserDto.email,
      },
    });

    if (!userEmail) {
      this.logger.warn('user does not exists!');
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [`user does not exists!`],
        error: 'Unauthorized',
      });
    }

    /*verify the password */
    const passVerify = await argon.verify(
      userEmail.password,
      signinUserDto.password,
    );
    if (!passVerify) {
      this.logger.warn('incorrect password, please try again!');
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['incorrect password, please try again!'],
        error: 'Unauthorized',
      });
    }

    return await this.jwtAccessToken(userEmail.id, userEmail.email);
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
        secret: this.configService.get<string>('JWT_SECRET'),
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
