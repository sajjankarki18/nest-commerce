import {
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

interface CustomRequest extends Request {
  user?: any;
}
interface JwtPayload {
  id: string;
  email: string;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeaders = req?.headers?.authorization;
    if (!authHeaders?.startsWith('Bearer ')) {
      this.logger.warn(`Invalid Bearer Token!`);
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['Please login to continue...!'],
        error: 'Unauthorized',
      });
    }

    const access_token = authHeaders.split(' ')[1];
    try {
      /* verify the access_token */
      const decryptedToken = this.jwtService.verify<JwtPayload>(access_token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      req.user = decryptedToken;
      next();
    } catch (error) {
      this.logger.error(`session expired or invalid, please try again!`, error);
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ['session expired or invalid, please try again later!'],
        error: 'Unauthorized',
      });
    }
  }
}
