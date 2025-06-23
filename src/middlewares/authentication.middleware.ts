import {
  HttpStatus,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  user?: any;
}

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const authHeaders = req?.headers?.authorization;
    if (!authHeaders?.startsWith("Bearer ")) {
      this.logger.warn("Bearer keyword is missing, please try again");
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ["please login to continue...!"],
        error: "Unauthorized",
      });
    }

    const access_token: string = authHeaders.split(" ")[1];
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const tokenVerify = await this.jwtService.verify(access_token, {
        secret: this.configService.get<string>("JWT_SECRET"),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      req.user = tokenVerify;
      next();
    } catch (error) {
      this.logger.warn("please login to continue", error);
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: ["please login to continue..!"],
        error: "Unauthorized",
      });
    }
  }
}
