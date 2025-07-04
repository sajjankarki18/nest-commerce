"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const banners_module_1 = require("./banners/banners.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const categories_module_1 = require("./categories/categories.module");
const products_module_1 = require("./products/products.module");
const collections_module_1 = require("./collections/collections.module");
const auth_users_module_1 = require("./auth_users/auth_users.module");
const v1_module_1 = require("./v1.module");
const device_types_module_1 = require("./device-types/device-types.module");
const authentication_middleware_1 = require("./middlewares/authentication.middleware");
const jwt_1 = require("@nestjs/jwt");
const cart_module_1 = require("./cart/cart.module");
const orders_module_1 = require("./orders/orders.module");
const customers_module_1 = require("./customers/customers.module");
const address_module_1 = require("./address/address.module");
const discount_module_1 = require("./discount/discount.module");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const customer_auth_middleware_1 = require("./middlewares/customer-auth.middleware");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(authentication_middleware_1.AuthenticationMiddleware)
            .exclude('/admin/auth_user/signin')
            .exclude('/admin/auth_user/signup')
            .forRoutes('/admin');
        consumer
            .apply(customer_auth_middleware_1.CustomerAuthMiddleware)
            .exclude('/account/customers/signup')
            .exclude('/account/customers/signin')
            .forRoutes('/account');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot({
                ttl: 60,
                limit: 10,
            }),
            v1_module_1.V1Module,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            jwt_1.JwtModule.register({}),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: 5432,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                autoLoadEntities: true,
                synchronize: true,
            }),
            banners_module_1.BannersModule,
            categories_module_1.CategoriesModule,
            products_module_1.ProductsModule,
            collections_module_1.CollectionsModule,
            auth_users_module_1.AuthUsersModule,
            device_types_module_1.DeviceTypesModule,
            cart_module_1.CartModule,
            orders_module_1.OrdersModule,
            customers_module_1.CustomersModule,
            address_module_1.AddressModule,
            discount_module_1.DiscountModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            common_1.Logger,
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map