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
import { ProductQuestion } from './entities/product-question.entity';
import { productAuthController } from './product-auth.controller';
import { ProductHelperService } from './product-helper.service';
import { Customer } from 'src/customers/entities/customer.entity';
import { productSpecification } from './entities/product-specification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductVariantPricing,
      ProductDescription,
      productSpecification,
      ProductImage,
      ProductQuestion,
      Customer,
    ]),
  ],
  controllers: [
    ProductAdminController,
    ProductController,
    productAuthController,
  ],
  providers: [ProductService, ProductHelperService, Logger],
})
export class ProductsModule {}
