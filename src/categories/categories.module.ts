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
import { ProductHelperService } from 'src/products/product-helper.service';
import { Customer } from 'src/customers/entities/customer.entity';
import { ProductQuestion } from 'src/products/entities/product-question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      ProductVariant,
      ProductVariantPricing,
      ProductImage,
      Customer,
      ProductQuestion,
    ]),
  ],
  controllers: [CategoriesAdminController, CategoriesController],
  providers: [CategoriesService, ProductHelperService, Logger],
})
export class CategoriesModule {}
