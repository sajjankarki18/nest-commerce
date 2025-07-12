import { Controller, Post, Req } from '@nestjs/common';
import { ordersService } from './orders.service';

@Controller('/account/orders')
export class OrdersController {
  constructor(private readonly orderService: ordersService) {}

  /* API controller to place a new customer order */
  @Post('/:cartId/place-order')
  placeOrder(@Req() req: { user: { userId: string } }) {
    const customerId: string = req.user?.userId;
    console.log(customerId);
    return this.orderService.placeOrder();
  }
}
