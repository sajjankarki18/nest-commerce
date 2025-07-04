"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let CustomerAuthMiddleware = class CustomerAuthMiddleware {
    jwtService;
    configService;
    logger;
    constructor(jwtService, configService, logger) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = logger;
    }
    use(req, res, next) {
        const authHeaders = req?.headers?.authorization;
        if (!authHeaders?.startsWith('Bearer ')) {
            this.logger.warn(`Invalid Bearer Token!`);
            throw new common_1.UnauthorizedException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: ['Please login to continue...!'],
                error: 'Unauthorized',
            });
        }
        const access_token = authHeaders.split(' ')[1];
        try {
            const decryptedToken = this.jwtService.verify(access_token, {
                secret: this.configService.get('CUSTOMER_JWT_SECRET'),
            });
            req.user = decryptedToken;
            next();
        }
        catch (error) {
            this.logger.error(`session expired or invalid, please try again!`, error);
            throw new common_1.UnauthorizedException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: ['session expired or invalid, please try again later!'],
                error: 'Unauthorized',
            });
        }
    }
};
exports.CustomerAuthMiddleware = CustomerAuthMiddleware;
exports.CustomerAuthMiddleware = CustomerAuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        common_1.Logger])
], CustomerAuthMiddleware);
//# sourceMappingURL=customer-auth.middleware.js.map