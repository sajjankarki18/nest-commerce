import { Logger, Module } from "@nestjs/common";
import { AuthUser } from "./entites/auth-user.entity";
import { AuthUserAdminController } from "./auth-user.admin.controller";
import { AuthUserService } from "./auth-user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthUser]),
    JwtModule.register({}),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AuthUserAdminController],
  providers: [AuthUserService, Logger, JwtService],
})
export class AuthUsersModule {}
