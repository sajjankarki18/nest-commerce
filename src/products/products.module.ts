import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantPricing } from './entities/product-variantPricing.entity';
import { ProductDescription } from './entities/product-description.entity';
import { ProductAdminController } from './products.admin.controller';
import { ProductService } from './products.service';
import { ProductImage } from './entities/product-image.entity';
import { ProductController } from './products.controller';
import { ProductQuestion } from './entities/product-question.dto';
import { productAuthController } from './product-auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductVariantPricing,
      ProductDescription,
      ProductImage,
      ProductQuestion,
    ]),
  ],
  controllers: [
    ProductAdminController,
    ProductController,
    productAuthController,
  ],
  providers: [ProductService, Logger],
})
export class ProductsModule {}
