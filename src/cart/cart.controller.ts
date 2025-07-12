import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cartItem.dto';

@Controller('/account/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /* add to cart */
  @Post('/add-to-cart')
  cartActions(
    @Req() customerReq: { user: { userId: string } },
    @Body() cartItemDto: CreateCartItemDto,
  ) {
    const customerId: string = customerReq.user?.userId;
    return this.cartService.cartActions(customerId, cartItemDto);
  }

  /* checkout cart */
  @Post('/checkout/:cartId')
  checkoutCart(@Param('cartId') cartId: string) {
    return this.cartService.checkoutCart(cartId);
  }

  /* get all carts for store */
  @Get()
  getAllCarts(@Req() customerReq: { user: { userId: string } }) {
    const customerId: string = customerReq.user?.userId;
    return this.cartService.getAllCarts(customerId);
  }
}
