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
exports.StoreAuthService = void 0;
const common_1 = require("@nestjs/common");
const customer_repository_1 = require("../customers/repositories/customer.repository");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let StoreAuthService = class StoreAuthService {
    customerRepository;
    jwtService;
    configService;
    logger;
    constructor(customerRepository, jwtService, configService, logger) {
        this.customerRepository = customerRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.logger = logger;
    }
    async checkCustomerExists(signupCustomerDto) {
        const customer = await this.customerRepository.findOne({
            where: {
                email: signupCustomerDto.email,
            },
        });
        if (customer) {
            throw new common_1.ConflictException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: ['customer with this email already exists!'],
                error: 'Conflict',
            });
        }
    }
    async signup(signupCustomerDto) {
        await this.checkCustomerExists(signupCustomerDto);
        const hashedPassword = await argon.hash(signupCustomerDto?.password);
        if (signupCustomerDto?.password !== signupCustomerDto.confirm_password) {
            throw new common_1.BadRequestException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
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
        }
        catch (error) {
            this.logger.warn('Invalid password, please try again later', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new account, please try again later!',
                ],
                error: 'Not Found',
            });
        }
    }
    async signin(signinCustomerDto) {
        const customerEmail = await this.customerRepository.findOne({
            where: {
                email: signinCustomerDto.email,
            },
        });
        if (!customerEmail) {
            this.logger.warn('Invalid email, please try again later');
            throw new common_1.UnauthorizedException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: ['Invalid email, please try again later!'],
                error: 'Not Found',
            });
        }
        const passVerify = await argon.verify(customerEmail?.password, signinCustomerDto?.password);
        if (!passVerify) {
            this.logger.warn('Invalid password, please try again later');
            throw new common_1.UnauthorizedException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: ['Invalid password, please try again later!'],
                error: 'Unauthorized',
            });
        }
        return await this.jwtAccessToken(customerEmail.id, customerEmail.email);
    }
    async jwtAccessToken(userId, email) {
        try {
            const payload = {
                userId: userId,
                email,
            };
            const access_token = await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: this.configService.get('CUSTOMER_JWT_SECRET'),
            });
            return {
                access_token: access_token,
            };
        }
        catch (error) {
            this.logger.error('some error occurred, while signing in', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while signing in, please try again later',
                ],
                error: 'Internal Server Error',
            });
        }
    }
};
exports.StoreAuthService = StoreAuthService;
exports.StoreAuthService = StoreAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customer_repository_1.CustomerRepository,
        jwt_1.JwtService,
        config_1.ConfigService,
        common_1.Logger])
], StoreAuthService);
//# sourceMappingURL=store-auth.service.js.map