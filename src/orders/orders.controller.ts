import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ordersService } from './orders.service';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('/account/orders')
export class OrdersController {
  constructor(private readonly orderService: ordersService) {}

  @Post('/:cartId/place-order')
  @ApiOperation({ summary: 'Place a new customer order' })
  @ApiParam({ name: 'cartId', type: String })
  placeOrder(
    @Req() req: { user: { userId: string } },
    @Param('cartId') cartId: string,
  ) {
    const customerId: string = req.user?.userId;
    return this.orderService.placeOrder(customerId, cartId);
  }

  @Post('/cancel-order/:orderNumber')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiParam({ name: 'orderNumber', type: Number })
  cancelOrder(
    @Param('orderNumber') orderNumber: number,
    @Req() req: { user: { userId: string } },
  ) {
    const customerId: string = req.user?.userId;
    return this.orderService.cancelOrder(orderNumber, customerId);
  }

  @Get('/order-lists')
  @ApiOperation({ summary: 'Get all orders list' })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'order_item_limit', type: Number, required: false })
  getAllOrdersList(
    @Req() req: { user: { userId: string } },
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order_item_limit') order_item_limit: number,
  ) {
    const customer_id: string = req.user?.userId;
    return this.orderService.getAllOrdersList(
      customer_id,
      page,
      limit,
      order_item_limit,
    );
  }
}
