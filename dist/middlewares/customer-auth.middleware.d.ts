import { Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
interface CustomRequest extends Request {
    user?: any;
}
export declare class CustomerAuthMiddleware implements NestMiddleware {
    private readonly jwtService;
    private readonly configService;
    private readonly logger;
    constructor(jwtService: JwtService, configService: ConfigService, logger: Logger);
    use(req: CustomRequest, res: Response, next: NextFunction): Promise<void>;
}
export {};
