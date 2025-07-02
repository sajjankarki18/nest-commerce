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
exports.CustomerAuthController = void 0;
const common_1 = require("@nestjs/common");
const store_auth_service_1 = require("../store-auth/store-auth.service");
const signup_customer_dto_1 = require("./dto/signup-customer.dto");
const signin_customer_dto_1 = require("./dto/signin-customer.dto");
const throttler_1 = require("@nestjs/throttler");
let CustomerAuthController = class CustomerAuthController {
    storeAuthService;
    constructor(storeAuthService) {
        this.storeAuthService = storeAuthService;
    }
    signup(signupCustomerDto) {
        return this.storeAuthService.signup(signupCustomerDto);
    }
    signin(signinCustomerDto) {
        return this.storeAuthService.signin(signinCustomerDto);
    }
};
exports.CustomerAuthController = CustomerAuthController;
__decorate([
    (0, throttler_1.Throttle)(10, 60),
    (0, common_1.Post)('/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_customer_dto_1.SignupCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomerAuthController.prototype, "signup", null);
__decorate([
    (0, throttler_1.Throttle)(5, 60),
    (0, common_1.Post)('/signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_customer_dto_1.SigninCustomerDto]),
    __metadata("design:returntype", void 0)
], CustomerAuthController.prototype, "signin", null);
exports.CustomerAuthController = CustomerAuthController = __decorate([
    (0, common_1.Controller)('/account/customers'),
    __metadata("design:paramtypes", [store_auth_service_1.StoreAuthService])
], CustomerAuthController);
//# sourceMappingURL=customers-auth.controller.js.map