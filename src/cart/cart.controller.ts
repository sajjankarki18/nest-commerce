import { Body, Controller, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cartItem.dto';

@Controller('/account/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add-to-cart')
  cartActions(
    @Req() customerReq: { user: { userId: string } },
    @Body() cartItemDto: CreateCartItemDto,
  ) {
    const customerId: string = customerReq.user?.userId;
    return this.cartService.cartActions(customerId, cartItemDto);
  }
}
