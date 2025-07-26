import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cartItem.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('/account/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * POST /account/cart/add-to-cart
   * Add an item to the cart
   */
  @Post('/add-to-cart')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: CreateCartItemDto })
  @ApiResponse({ status: 201, description: 'Item added to cart' })
  cartActions(
    @Req() customerReq: { user: { userId: string } },
    @Body() cartItemDto: CreateCartItemDto,
  ) {
    const customerId: string = customerReq.user?.userId;
    return this.cartService.cartActions(customerId, cartItemDto);
  }

  /**
   * POST /account/cart/checkout/:cartId
   * Checkout a cart
   */
  @Post('/checkout/:cartId')
  @ApiOperation({ summary: 'Checkout cart' })
  @ApiParam({ name: 'cartId', type: String })
  @ApiResponse({ status: 200, description: 'Cart checked out' })
  checkoutCart(
    @Param('cartId') cartId: string,
    @Req() req: { user: { userId: string } },
  ) {
    const customerId: string = req.user?.userId;
    return this.cartService.checkoutCart(cartId, customerId);
  }

  /**
   * GET /account/cart/checkout/:cartId
   * Get checkout details for a cart
   */
  @Get('/checkout/:cartId')
  @ApiOperation({ summary: 'Get checkout cart details' })
  @ApiParam({ name: 'cartId', type: String })
  @ApiResponse({ status: 200, description: 'Checkout cart details' })
  getCheckoutCartDetails(
    @Param('cartId') cartId: string,
    @Req() req: { user: { userId: string } },
  ) {
    const customerId: string = req.user?.userId;
    return this.cartService.getCheckoutCartDetails(cartId, customerId);
  }

  /**
   * GET /account/cart
   * Get all carts for the store
   */
  @Get()
  @ApiOperation({ summary: 'Get all carts for store' })
  @ApiResponse({ status: 200, description: 'List of carts' })
  getAllCarts(@Req() customerReq: { user: { userId: string } }) {
    const customerId: string = customerReq.user?.userId;
    return this.cartService.getAllCarts(customerId);
  }
}
