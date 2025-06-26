import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesAdminController } from './categories.admin.controller';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Product } from 'src/products/entities/product.entity';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantPricing } from 'src/products/entities/product-variantPricing.entity';
import { ProductImage } from 'src/products/entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      ProductVariant,
      ProductVariantPricing,
      ProductImage,
    ]),
  ],
  controllers: [CategoriesAdminController, CategoriesController],
  providers: [CategoriesService, Logger],
})
export class CategoriesModule {}
