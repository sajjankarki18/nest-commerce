import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantPricing } from './entities/product-variantPricing.entity';
import { ProductDescription } from './entities/product-description.entity';
import { ProductAdminController } from './products.admin.controller';
import { ProductService } from './products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductVariantPricing,
      ProductDescription,
    ]),
  ],
  controllers: [ProductAdminController],
  providers: [ProductService, Logger],
})
export class ProductsModule {}
