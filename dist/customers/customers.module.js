"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const customers_controller_1 = require("./customers.controller");
const customers_service_1 = require("./customers.service");
const store_auth_service_1 = require("../store-auth/store-auth.service");
const customer_repository_1 = require("./repositories/customer.repository");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const customers_auth_controller_1 = require("./customers-auth.controller");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let CustomersModule = class CustomersModule {
};
exports.CustomersModule = CustomersModule;
exports.CustomersModule = CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customer_entity_1.Customer]),
            jwt_1.JwtModule.register({}),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
        ],
        controllers: [customers_controller_1.CustomersController, customers_auth_controller_1.CustomerAuthController],
        providers: [customers_service_1.CustomersService, store_auth_service_1.StoreAuthService, customer_repository_1.CustomerRepository, common_1.Logger],
    })
], CustomersModule);
//# sourceMappingURL=customers.module.js.map