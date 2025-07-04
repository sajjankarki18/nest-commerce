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
exports.AuthUserAdminController = void 0;
const common_1 = require("@nestjs/common");
const auth_user_service_1 = require("./auth-user.service");
const swagger_1 = require("@nestjs/swagger");
const signup_user_dto_1 = require("./dto/signup-user.dto");
const signin_user_dto_1 = require("./dto/signin-user.dto");
const throttler_1 = require("@nestjs/throttler");
let AuthUserAdminController = class AuthUserAdminController {
    authUserService;
    constructor(authUserService) {
        this.authUserService = authUserService;
    }
    signupUser(signupUserDto) {
        return this.authUserService.signupUser(signupUserDto);
    }
    signinUser(siginUserDto) {
        return this.authUserService.signinUser(siginUserDto);
    }
};
exports.AuthUserAdminController = AuthUserAdminController;
__decorate([
    (0, throttler_1.Throttle)(10, 60),
    (0, throttler_1.Throttle)(10, 60),
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_user_dto_1.SignupUserDto]),
    __metadata("design:returntype", void 0)
], AuthUserAdminController.prototype, "signupUser", null);
__decorate([
    (0, throttler_1.Throttle)(5, 60),
    (0, throttler_1.Throttle)(5, 60),
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_user_dto_1.SigninUserDto]),
    __metadata("design:returntype", void 0)
], AuthUserAdminController.prototype, "signinUser", null);
exports.AuthUserAdminController = AuthUserAdminController = __decorate([
    (0, swagger_1.ApiTags)('Autentication workflow'),
    (0, common_1.Controller)('/admin/auth_user'),
    __metadata("design:paramtypes", [auth_user_service_1.AuthUserService])
], AuthUserAdminController);
//# sourceMappingURL=auth-user.admin.controller.js.map