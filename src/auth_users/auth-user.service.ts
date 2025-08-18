import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUserRepository } from './repositories/auth-user.repository';
import * as argon from 'argon2';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminUser } from './entites/auth-user.entity';

@Injectable()
export class AuthUserService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(AdminUser)
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
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['Failed to register user. Email is already in use.'],
        error: 'Conflict',
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
    return await this.authUserRepository.manager.transaction(
      async (signupManager) => {
        try {
          await this.validateUserEmail(signinUserDto);
          this.confirmPassword(signinUserDto);

          /* hash the user password before creating it */
          const hashedPassword = await argon.hash(signinUserDto.password);
          const user = signupManager.create(AdminUser, {
            first_name: signinUserDto.first_name,
            last_name: signinUserDto.last_name,
            email: signinUserDto.email.trim().toLowerCase(),
            password: hashedPassword,
            phone_number: signinUserDto.phone_number,
            status: signinUserDto.status,
          });

          this.logger.log('User has beem registered successfully');
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
          this.logger.error(
            `Some error occurred while creating new account, please try again.`,
            error,
          );
          throw new InternalServerErrorException({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: ['Some error occurred while creating a new user'],
            error: 'Internal Server Error',
          });
        }
      },
    );
  }

  /* log in into the existing user */
  async signinUser(signinUserDto: SigninUserDto) {
    /* check user's email exists */
    const normalizedUserEmail = signinUserDto.email.trim().toLowerCase();
    const userEmail = await this.authUserRepository.findOne({
      where: {
        email: normalizedUserEmail,
      },
    });

    if (!userEmail) {
      this.logger.warn('User does not exists!');
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
        message: ['Incorrect password, please try again!'],
        error: 'Unauthorized',
      });
    }

    return await this.jwtAccessToken(userEmail.id, userEmail.email);
  }

  /* generate a new access-token when user logs in */
  async jwtAccessToken(userId: string, email: string) {
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
          'Some error occurred while signing in, please try again later',
        ],
        error: 'Internal Server Error',
      });
    }
  }
}
