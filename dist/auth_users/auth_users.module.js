"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUsersModule = void 0;
const common_1 = require("@nestjs/common");
const auth_user_entity_1 = require("./entites/auth-user.entity");
const auth_user_admin_controller_1 = require("./auth-user.admin.controller");
const auth_user_service_1 = require("./auth-user.service");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthUsersModule = class AuthUsersModule {
};
exports.AuthUsersModule = AuthUsersModule;
exports.AuthUsersModule = AuthUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([auth_user_entity_1.AuthUser]),
            jwt_1.JwtModule.register({}),
            config_1.ConfigModule.forRoot({ isGlobal: true }),
        ],
        controllers: [auth_user_admin_controller_1.AuthUserAdminController],
        providers: [auth_user_service_1.AuthUserService, common_1.Logger, jwt_1.JwtService],
    })
], AuthUsersModule);
//# sourceMappingURL=auth_users.module.js.map