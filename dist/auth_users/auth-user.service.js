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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_user_entity_1 = require("./entites/auth-user.entity");
const auth_user_repository_1 = require("./repositories/auth-user.repository");
const argon = require("argon2");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthUserService = class AuthUserService {
    logger;
    authUserRepository;
    jwtService;
    configService;
    constructor(logger, authUserRepository, jwtService, configService) {
        this.logger = logger;
        this.authUserRepository = authUserRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUserEmail(signupUserDto) {
        const userEmail = await this.authUserRepository.findOne({
            where: {
                email: signupUserDto.email,
            },
        });
        if (userEmail) {
            this.logger.warn('email is aleady in use');
            throw new common_1.BadRequestException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: ['cannot create account, email already in use'],
                error: 'BadRequest',
            });
        }
    }
    async signupUser(signinUserDto) {
        await this.validateUserEmail(signinUserDto);
        try {
            const hashedPassword = await argon.hash(signinUserDto.password);
            const user = this.authUserRepository.create({
                username: signinUserDto.username,
                email: signinUserDto.email,
                password: hashedPassword,
                phone_number: signinUserDto.phone_number,
                status: signinUserDto.status,
            });
            this.logger.log('the user has beem created successfully');
            return await this.authUserRepository.save(user);
        }
        catch (error) {
            this.logger.error(`some error occurred while creating a new user`, error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: ['some error occurred while creating a new user'],
                error: 'Internal Server Error',
            });
        }
    }
    async signinUser(signinUserDto) {
        const userEmail = await this.authUserRepository.findOne({
            where: {
                email: signinUserDto.email,
            },
        });
        if (!userEmail) {
            this.logger.warn('user does not exists!');
            throw new common_1.UnauthorizedException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: [`user does not exists!`],
                error: 'Unauthorized',
            });
        }
        const passVerify = await argon.verify(userEmail.password, signinUserDto.password);
        if (!passVerify) {
            this.logger.warn('incorrect password, please try again!');
            throw new common_1.UnauthorizedException({
                statusCode: common_1.HttpStatus.UNAUTHORIZED,
                message: ['incorrect password, please try again!'],
                error: 'Unauthorized',
            });
        }
        return await this.jwtAccessToken(userEmail.id, userEmail.email);
    }
    async jwtAccessToken(userId, email) {
        try {
            const payload = {
                userId: userId,
                email,
            };
            const access_token = await this.jwtService.signAsync(payload, {
                expiresIn: '7d',
                secret: this.configService.get('JWT_SECRET'),
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
exports.AuthUserService = AuthUserService;
exports.AuthUserService = AuthUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(auth_user_entity_1.AuthUser)),
    __metadata("design:paramtypes", [common_1.Logger,
        auth_user_repository_1.AuthUserRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthUserService);
//# sourceMappingURL=auth-user.service.js.map