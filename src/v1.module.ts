import { Module } from '@nestjs/common';
import { BannersModule } from './banners/banners.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CollectionsModule } from './collections/collections.module';
import { AuthUsersModule } from './auth_users/auth_users.module';

@Module({
  imports: [
    BannersModule,
    ProductsModule,
    CategoriesModule,
    CollectionsModule,
    AuthUsersModule,
  ],
})
export class V1Module {}
