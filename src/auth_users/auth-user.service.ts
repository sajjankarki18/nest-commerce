import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthUser } from "./entites/auth-user.entity";
import { AuthUserRepository } from "./repositories/auth-user.repository";
import * as argon from "argon2";
import { SignupUserDto } from "./dto/signup-user.dto";
import { SigninUserDto } from "./dto/signin-user.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

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
    const userEmail = await this.authUserRepository.findOne({
      where: {
        email: signupUserDto.email,
      },
    });

    /* if the email exists already in the database,
    then do not allow the user to create a new account */
    if (userEmail) {
      this.logger.warn("email is aleady in use");
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: ["Cannot create account, email already in use"],
        error: "BadRequest",
      });
    }
  }

  /* create a new user */
  async signupUser(signupUserDto: SignupUserDto): Promise<AuthUser> {
    await this.validateUserEmail(signupUserDto);
    try {
      /* hash the user password before creating it */
      const hashedPassword = await argon.hash(signupUserDto.password);
      const user = this.authUserRepository.create({
        first_name: signupUserDto.first_name,
        last_name: signupUserDto.last_name,
        email: signupUserDto.email,
        password: hashedPassword,
        phone_number: signupUserDto.phone_number,
        status: signupUserDto.status,
      });

      this.logger.log("the user has beem created successfully");
      return await this.authUserRepository.save(user);
    } catch (error) {
      this.logger.error(`Some error occurred while creating a new user`, error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ["Some error occurred while creating a new user"],
        error: "Internal Server Error",
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
      this.logger.warn("Invalid email, please try again!");
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: [`Invalid email, please try again!`],
        error: "Unauthorized",
      });
    }

    /*verify the password */
    const passVerify = await argon.verify(
      userEmail.password,
      signinUserDto.password,
    );
    if (!passVerify) {
      this.logger.warn("Incorrect password, please try again!");
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ["Incorrect password, please try again!"],
        error: "Unauthorized",
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
        expiresIn: "7d",
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      return {
        access_token: access_token,
      };
    } catch (error) {
      this.logger.error("some error occurred, while signing in", error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while signing in, please try again later",
        ],
        error: "Internal Server Error",
      });
    }
  }
}
