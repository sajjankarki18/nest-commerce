import { Logger, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/products/entities/product.entity';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantPricing } from 'src/products/entities/product-variantPricing.entity';
import { ProductImage } from 'src/products/entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Product,
      ProductVariant,
      ProductVariantPricing,
      ProductImage,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, Logger],
})
export class CartModule {}
