import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartRepository } from './repositories/cart.repository';
import { CartItem } from './entities/cart-item.entity';
import { CartItemRepository } from './repositories/cart-item.repository';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { CartStatusEnum } from 'src/enums/cart-status.enum';
import { Product } from 'src/products/entities/product.entity';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantRepository } from 'src/products/repositories/product-variant.repository';
import { ProductVariantPricing } from 'src/products/entities/product-variantPricing.entity';
import { ProductVariantPricingRepository } from 'src/products/repositories/product-variantPricing.repository';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { In } from 'typeorm';

const SHIPPING_PRICE: number = 100;
const MAX_QUANTITY: number = 10;

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: ProductVariantRepository,
    @InjectRepository(ProductVariantPricing)
    private readonly productVariantPricingRepository: ProductVariantPricingRepository,
  ) {}

  /* re-usable function to display add-to-cart message,
   when an item has been added to cart */
  addToCartMessage(): { message: string } {
    return {
      message: `Item has been added to cart!`,
    };
  }

  /* validate the cart quantity -> Throw an exception when the quantity provided is more than 25 */
  async validateCartQuantity(cartItemDto: CreateCartItemDto) {
    const variant = await this.productVariantRepository.findOne({
      where: {
        id: cartItemDto.variant_id,
      },
    });

    if (!variant) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Variant not found!`],
        error: 'Not Found',
      });
    }

    /* Check if user enters quantity that is more than the actual quantity exists in the DB */
    if (cartItemDto.quantity > variant.quantity) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: [
          `Requested quantity of ${cartItemDto.quantity} exeeds the availability of existing stock!`,
        ],
        error: 'Conflict',
      });
    }

    /* check if the quantity exeeds the max_quantity and check,
    if the user enter the quantity greatest than the quantity already exists */
    if (cartItemDto.quantity > MAX_QUANTITY) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['You can only add upto 50 units of products in your cart!'],
        error: 'Conflict',
      });
    }
  }

  /* 
  check if customer has added the same product that already exists in cart,
  if it does exists, then update the quantity only. 
  or else create a new cart-item for that product.
  */
  async validateProductVariantExists(
    cartItemDto: CreateCartItemDto,
  ): Promise<boolean> {
    const cartItemExists = await this.cartItemRepository.findOne({
      where: {
        variant_id: cartItemDto.variant_id,
      },
    });

    if (cartItemExists) {
      await this.cartItemRepository.update(
        { variant_id: cartItemDto.variant_id },
        {
          quantity: cartItemDto.quantity,
        },
      );

      return true;
    }

    return false;
  }

  /* fetch product-details to display at frontend */
  async getProductDetails(cartItemDto: CreateCartItemDto) {
    const product = await this.productRepository.findOne({
      where: {
        id: cartItemDto.product_id,
        status: StatusEnumType.Published,
      },
    });

    /* throw an exception if the product and it's variant not found */
    if (!product) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`product and it's variant not found, please try again!`],
        error: 'Not Found',
      });
    }

    const variantPricing = await this.productVariantPricingRepository.findOne({
      where: {
        variant_id: cartItemDto?.variant_id,
      },
    });

    return {
      product: product,
      variantPricing: variantPricing,
    };
  }

  /* validate weather the products-variant is in stock */
  async checkVariantInStock(cartItemDto: CreateCartItemDto) {
    const productVariant = await this.productVariantRepository.findOne({
      where: {
        id: cartItemDto.variant_id,
      },
    });

    /* if the product's variant is not currently in stock, just throw an exception */
    if (productVariant?.in_stock === false) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: [`The variant is not currently in stock!`],
        error: 'Bad Request',
      });
    }

    return;
  }

  /* if the quantity is given as 0, then directly remove the item from the cart */
  async removeCart(cartItemDto: CreateCartItemDto): Promise<boolean> {
    if (cartItemDto.quantity <= 0) {
      await this.cartItemRepository.delete({
        variant_id: cartItemDto.variant_id,
      });

      return true;
    }

    return false;
  }

  /* calucate total-cost of all cart */
  async calculateTotalCartPrice(customerId: string): Promise<number> {
    const cart = await this.cartRepository.findOne({
      where: {
        customer_id: customerId,
      },
    });
    const cartItems = await this.cartItemRepository.find({
      where: { cart_id: cart?.id },
    });

    let total_price: number = 0;
    /* calculate the total_price */
    for (const cartItem of cartItems) {
      const cartPrice: number = cartItem.quantity * cartItem.selling_price;
      total_price += cartPrice;
    }

    return total_price;
  }

  /* add to cart logic */
  async cartActions(customerId: string, cartItemDto: CreateCartItemDto) {
    /* validate cart-quantity before creating the cart */
    await this.validateCartQuantity(cartItemDto);

    /* check if product-variant is in stock */
    await this.checkVariantInStock(cartItemDto);

    /* fetch related product and variant-pricing details */
    const productDetails = await this.getProductDetails(cartItemDto);

    /* remove the item from the cart if the quantity is given as 0 */
    const checkCartRemoved = await this.removeCart(cartItemDto);
    if (checkCartRemoved) {
      return {
        message: 'Product has been removed successfully',
      };
    }

    /* check if the cart exists, if it's your first time adding an item to your cart */
    const existingCart = await this.cartRepository.findOne({
      where: {
        customer_id: customerId,
      },
    });

    /*
    case-1
    If the cart does not exists, create a new cart for authenticated user
    */
    if (!existingCart) {
      /* create a new cart */
      const cart = this.cartRepository.create({
        customer_id: customerId,
        shipping_price: SHIPPING_PRICE,
        total_price: 0,
        sub_total: 0,
        cart_status: CartStatusEnum.Pending,
      });

      const savedCart = await this.cartRepository.save(cart);

      /* create new cart-item with saved cart */
      const cartItem = this.cartItemRepository.create({
        product_id: cartItemDto.product_id,
        variant_id: cartItemDto.variant_id,
        product_title: productDetails.product?.title,
        selling_price: productDetails.variantPricing?.selling_price,
        crossed_price: productDetails.variantPricing?.crossed_price,
        quantity: cartItemDto.quantity,
        cart_id: savedCart.id,
      });

      await this.cartItemRepository.save(cartItem);

      /* calculate total_price and update the total on cart */
      const total_price = await this.calculateTotalCartPrice(customerId);
      await this.cartRepository.update(
        { id: savedCart.id },
        {
          sub_total: total_price,
          total_price: total_price + SHIPPING_PRICE,
        },
      );
      return this.addToCartMessage(); /* add to cart message */
    }

    /*
    case-2
    if the cart already exists, then add new items with that associated cart
    */

    /* check weather the customer adds the same product, if he does then update the quantity of that product only */
    const variantsExists = await this.validateProductVariantExists(cartItemDto);
    if (variantsExists) {
      return {
        message: `Quantity has been updated`,
      };
    }

    /* create a new cart-item */
    const newCartItem = this.cartItemRepository.create({
      product_id: cartItemDto.product_id,
      variant_id: cartItemDto.variant_id,
      product_title: productDetails.product?.title,
      selling_price: productDetails.variantPricing?.selling_price,
      crossed_price: productDetails.variantPricing?.crossed_price,
      quantity: cartItemDto.quantity,
      cart_id: existingCart.id,
    });

    await this.cartItemRepository.save(newCartItem);
    const total_price: number =
      await this.calculateTotalCartPrice(
        customerId,
      ); /* calculate the total_price */

    /* update the existing cart */
    await this.cartRepository.update(
      { customer_id: customerId },
      {
        sub_total: total_price,
        total_price: total_price + SHIPPING_PRICE,
      },
    );
    return this.addToCartMessage();
  }

  /* cart checkout function */
  async checkoutCart(cartId: string) {
    /* list of payment_methods for a customer to pay for their products */
    const payment_methods: string[] = [
      'Esewa',
      'khalti',
      'Nabil Bank',
      'Siddhartha Bank',
      'Cash on Delivery',
    ];

    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
      },
    });

    /* if the cart is not found then throw an not-found exception */
    if (!cart) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Cart with ${cartId} not found!`],
        error: 'Not Found',
      });
    }

    /* fetch all cart_items(products) in the cart */
    const cartItems = await this.cartItemRepository.find({
      where: {
        cart_id: In([cart.id]),
      },
    });

    /* update the cart-status as completed */
    await this.cartRepository.update(
      { id: cart?.id },
      {
        cart_status: CartStatusEnum.Completed,
      },
    );

    return {
      data: {
        cart_id: cart?.id,
        cart_status: cart?.cart_status,
        created_at: cart.created_at.toISOString().split('T')[0],
        payment_methods: payment_methods,
        cart_items: cartItems,
        shipping_fee: cart.shipping_price,
        sub_total: parseFloat(Number(cart?.sub_total).toFixed(2)),
        total: parseFloat(Number(cart?.total_price).toFixed(2)),
      },
    };
  }

  /* get all carts */
  async getAllCarts(customerId: string) {
    const cart = await this.cartRepository.findOne({
      where: {
        customer_id: customerId,
      },
      select: [
        'id',
        'customer_id',
        'shipping_price',
        'sub_total',
        'total_price',
      ],
    });

    if (!cart) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['No cart found associated with the customer!'],
        error: 'Not Found',
      });
    }

    const cartItems = await this.cartItemRepository.find({
      where: {
        cart_id: cart.id,
      },
      select: [
        'id',
        'product_id',
        'variant_id',
        'selling_price',
        'crossed_price',
        'quantity',
      ],
    });

    return {
      data: {
        ...cart,
        cart_items: cartItems,
      },
    };
  }
}
