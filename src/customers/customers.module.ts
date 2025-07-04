import { Logger, Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { StoreAuthService } from 'src/store-auth/store-auth.service';
import { CustomerRepository } from './repositories/customer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAuthController } from './customers-auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    JwtModule.register({}),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [CustomersController, CustomerAuthController],
  providers: [CustomersService, StoreAuthService, CustomerRepository, Logger],
})
export class CustomersModule {}
