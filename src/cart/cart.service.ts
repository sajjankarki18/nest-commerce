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
const MAX_QUANTITY: number = 25;

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
  validateCartQuantity(cartItemDto: CreateCartItemDto): void {
    if (cartItemDto.quantity > MAX_QUANTITY) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['You can only add upto 25 units of products in your cart!'],
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

    const productVariant = await this.productVariantRepository.findOne({
      where: {
        product_id: product?.id,
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
        variant_id: productVariant?.id,
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
      where: { cart_id: In([cart?.id]) },
    });

    let total_price: number = 0;
    /* calculate the total_price */
    for (const cartItem of cartItems) {
      const cartPrice: number = cartItem.quantity * cartItem.price;
      total_price += cartPrice;
    }

    return total_price;
  }

  /* add to cart logic */
  async cartActions(customerId: string, cartItemDto: CreateCartItemDto) {
    /* validate cart-quantity before creating the cart */
    this.validateCartQuantity(cartItemDto);

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
    If the cart does not exists, create a new cart for authenitcation user
    */
    if (!existingCart) {
      /* create a new cart */
      const cart = this.cartRepository.create({
        customer_id: customerId,
        shipping_price: SHIPPING_PRICE,
        total_price: 0,
        cart_status: CartStatusEnum.Pending,
      });

      const savedCart = await this.cartRepository.save(cart);

      /* create new cart-item with saved cart */
      const cartItem = this.cartItemRepository.create({
        product_id: cartItemDto.product_id,
        variant_id: cartItemDto.variant_id,
        product_title: productDetails.product?.title,
        price: productDetails.variantPricing?.selling_price,
        quantity: cartItemDto.quantity,
        cart_id: savedCart.id,
      });

      await this.cartItemRepository.save(cartItem);

      /* calculate total_price and update the total on cart */
      const total_price = await this.calculateTotalCartPrice(customerId);
      await this.cartRepository.update(
        { id: savedCart.id },
        {
          total_price: total_price,
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
      return this.addToCartMessage();
    }

    /* create a new cart-item */
    const newCartItem = this.cartItemRepository.create({
      product_id: cartItemDto.product_id,
      variant_id: cartItemDto.variant_id,
      product_title: productDetails.product?.title,
      price: productDetails.variantPricing?.selling_price,
      quantity: cartItemDto.quantity,
      cart_id: existingCart.id,
    });

    await this.cartItemRepository.save(newCartItem);
    await this.calculateTotalCartPrice(
      customerId,
    ); /* calculate the total_price */
    return this.addToCartMessage();
  }
}
