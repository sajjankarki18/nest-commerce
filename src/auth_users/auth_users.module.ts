import { Logger, Module } from '@nestjs/common';
import { AuthUserAdminController } from './auth-user.admin.controller';
import { AuthUserService } from './auth-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AdminUser } from './entites/auth-user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminUser]),
    JwtModule.register({}),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AuthUserAdminController],
  providers: [AuthUserService, Logger, JwtService],
})
export class AuthUsersModule {}
