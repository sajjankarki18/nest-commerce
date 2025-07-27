import { Logger, Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ordersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { ProductImage } from 'src/products/entities/product-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem, ProductImage]),
  ],
  controllers: [OrdersController],
  providers: [ordersService, Logger],
})
export class OrdersModule {}
