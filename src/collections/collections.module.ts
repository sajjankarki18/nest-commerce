import { Logger, Module } from '@nestjs/common';
import { CollectionsAdminController } from './collections.admin.controller';
import { CollectionsService } from './collections.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionRedirect } from './entities/collection-redirect.entity';
import { Collection } from './entities/collection.entity';
import { CollectionController } from './collections.controller';
import { Product } from 'src/products/entities/product.entity';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantPricing } from 'src/products/entities/product-variantPricing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Collection,
      CollectionRedirect,
      Product,
      ProductImage,
      ProductVariant,
      ProductVariantPricing,
    ]),
  ],
  controllers: [CollectionsAdminController, CollectionController],
  providers: [CollectionsService, Logger],
})
export class CollectionsModule {}
