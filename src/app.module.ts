import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BannersModule } from './banners/banners.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CollectionsModule } from './collections/collections.module';
import { AuthUsersModule } from './auth_users/auth_users.module';
import { V1Module } from './v1.module';
import { DeviceTypesModule } from './device-types/device-types.module';
import { AuthenticationMiddleware } from './middlewares/authentication.middleware';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { AddressModule } from './address/address.module';
import { DiscountModule } from './discount/discount.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CustomerAuthMiddleware } from './middlewares/customer-auth.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    V1Module,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    BannersModule,
    CategoriesModule,
    ProductsModule,
    CollectionsModule,
    AuthUsersModule,
    DeviceTypesModule,
    CartModule,
    OrdersModule,
    CustomersModule,
    AddressModule,
    DiscountModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude('/admin/auth_user/signin')
      .exclude('/admin/auth_user/signup')
      .forRoutes('/admin');

    consumer
      .apply(CustomerAuthMiddleware)
      .exclude('/admin/auth_user/signin')
      .exclude('/admin/auth_user/signup')
      .forRoutes('/account');
  }
}
