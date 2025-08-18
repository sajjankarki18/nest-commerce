import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemRepository } from './repositories/order-item.repository';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartRepository } from 'src/cart/repositories/cart.repository';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { CartItemRepository } from 'src/cart/repositories/cart-item.repository';
import { OrderStatusEnum } from 'src/enums/order-status.enum';
import { CartStatusEnum } from 'src/enums/cart-status.enum';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductImageRepository } from 'src/products/repositories/product-image.repository';

const MAX_ORDERS_PER_PAGE: number = 5;

@Injectable()
export class ordersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: OrderItemRepository,
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: ProductImageRepository,
    private readonly logger: Logger,
  ) {}

  /* helper function to fetch product-images */
  /* api service to place an order */
  async placeOrder(customerId: string, cartId: string) {
    /* check if the cart exists */
    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
        customer_id: customerId,
      },
    });

    if (!cart) {
      this.logger.log('Cart associated with the customer not found');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Cart associated with the customer not found'],
        error: 'Not Found',
      });
    }

    /* check if the order with cart exists, if not create one */
    const checkoutCart = await this.orderRepository.findOne({
      where: {
        cart_id: cartId,
      },
    });

    if (checkoutCart) {
      return checkoutCart;
    } else {
      try {
        /* create a new order */
        const order = this.orderRepository.create({
          customer_id: customerId,
          cart_id: cartId,
          order_status: OrderStatusEnum.Placed,
          shipping_price: cart.shipping_price,
          sub_total: cart.sub_total,
          total_price: cart.total_price,
        });

        const savedOrder = await this.orderRepository.save(order);

        /* after creating a new order, set cartStatus as completed */
        await this.cartRepository.update(
          { id: savedOrder.cart_id },
          {
            cart_status: CartStatusEnum.Completed,
          },
        );

        /* now migrate all the cartItems data to the order-table */
        const cartItems = await this.cartItemRepository.find({
          where: {
            cart_id: savedOrder.cart_id,
          },
        });

        const orderItems = cartItems.map((cartItem) => {
          return this.orderItemRepository.create({
            product_id: cartItem.product_id,
            variant_id: cartItem.variant_id,
            product_title: cartItem.product_title,
            selling_price: cartItem.selling_price,
            crossed_price: cartItem.crossed_price,
            order_id: savedOrder?.id,
          });
        });

        await this.orderItemRepository.save(orderItems);
        return {
          message: 'Your order has been placed.',
        };
      } catch (error) {
        this.logger.error(
          'Some error occurred while placing an order please try again.',
          error,
        );
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: [
            'Some error occurred while placing an order, please try again later.',
          ],
          error: 'Not Found',
        });
      }
    }
  }

  /* api service to cancel the order */
  async cancelOrder(orderNumber: number, customerId: string) {
    const order = await this.orderRepository.findOne({
      where: {
        order_number: orderNumber,
        customer_id: customerId,
      },
    });

    if (!order) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Order associated with the user has not found.'],
        error: 'Not Found',
      });
    }

    /* if the order has been already cancelled or rejected.
    Don't allow to re-cancel the order again */
    if (
      order.order_status === OrderStatusEnum.Cancelled ||
      order.order_status === OrderStatusEnum.Rejected
    ) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: [
          'Cancellation failed. Your order has already been cancelled.',
        ],
        error: 'Conflict',
      });
    }

    /* Only allow to update the order, if the order is in placed status */
    if (order.order_status === OrderStatusEnum.Placed) {
      await this.orderRepository.update(
        { id: order?.id },
        {
          order_status: OrderStatusEnum.Cancelled,
        },
      );

      return {
        message: 'Your order has been cancelled',
      };
    } else {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: [
          'Cancellation failed. Your order has already been delivered.',
        ],
        error: 'Conflict',
      });
    }
  }

  /* get lists of orders */
  async getAllOrdersList(
    customerId: string,
    page: number,
    limit: number,
    order_item_limit: number,
  ) {
    /* validate the page and limit data */
    if (
      isNaN(Number(page)) ||
      isNaN(Number(limit)) ||
      isNaN(Number(order_item_limit))
    ) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['Page and limit should be of positive integers.'],
        error: 'Conflict',
      });
    }

    if (page < 1 || limit < 1 || order_item_limit < 1) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        messae: ['page and limit should be of positive integers.'],
        error: 'Conflict',
      });
    }

    /* limit the orders-lists to 5 */
    const newLimit: number =
      limit > MAX_ORDERS_PER_PAGE ? MAX_ORDERS_PER_PAGE : limit;

    const [orders, totalOrders] = await this.orderRepository.findAndCount({
      where: {
        customer_id: customerId,
      },
      select: ['id', 'order_number', 'order_status', 'created_at'],
      skip: (page - 1) * newLimit,
      take: newLimit,
      order: { created_at: 'desc' },
    });

    /* map through each orders data and fetch all order-items */
    const ordersData = await Promise.all(
      orders.map(async (order) => {
        const [orderItems, totalOrderItems] =
          await this.orderItemRepository.findAndCount({
            where: {
              order_id: order.id,
            },
            take: order_item_limit,
            select: [
              'id',
              'product_id',
              'variant_id',
              'product_title',
              'crossed_price',
              'selling_price',
              'quantity',
            ],
          });

        return {
          ...order,
          order_items: orderItems,
          order_item_total: totalOrderItems,
        };
      }),
    );

    return {
      data: ordersData,
      page: page,
      limit: newLimit,
      total: totalOrders,
    };
  }
}
