import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ordersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrdersController],
  providers: [ordersService],
})
export class OrdersModule {}
