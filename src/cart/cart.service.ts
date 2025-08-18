import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartRepository } from './repositories/cart.repository';
import { CartItem } from './entities/cart-item.entity';
import { CartItemRepository } from './repositories/cart-item.repository';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { CartStatusEnum } from 'src/enums/cart-status.enum';
import { CartHelperService } from './cart-helper.service';

const SHIPPING_PRICE: number = 100;

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
    private readonly cartHelperService: CartHelperService,
    private readonly logger: Logger,
  ) {}

  /* add-to-cart logic */
  async cartActions(customerId: string, cartItemDto: CreateCartItemDto) {
    this.logger.log(
      `Performing cart actions for customer_id: ${customerId}, product_id: ${cartItemDto.product_id}`,
    );
    await this.cartHelperService.validateCartQuantity(cartItemDto);
    await this.cartHelperService.checkVariantInStock(cartItemDto);
    const productDetails =
      await this.cartHelperService.getProductDetails(cartItemDto);

    const checkCartRemoved =
      await this.cartHelperService.removeCart(cartItemDto);
    if (checkCartRemoved) {
      this.logger.log('Product has been removed from cart.');
      return {
        message: 'Product has been removed from cart',
      };
    }

    const existingCart = await this.cartRepository.findOne({
      where: {
        customer_id: customerId,
      },
    });

    if (!existingCart) {
      this.logger.log('No existing cart found. Creating new cart.');
      const cart = this.cartRepository.create({
        customer_id: customerId,
        shipping_price: SHIPPING_PRICE,
        total_price: 0,
        sub_total: 0,
        cart_status: CartStatusEnum.Pending,
      });

      const savedCart = await this.cartRepository.save(cart);

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

      const total_price =
        await this.cartHelperService.calculateTotalCartPrice(customerId);
      await this.cartRepository.update(
        { id: savedCart.id },
        {
          sub_total: total_price,
          total_price: total_price + SHIPPING_PRICE,
        },
      );
      this.logger.log('New cart and cart item created successfully.');
      return this.cartHelperService.addToCartMessage();
    }

    const variantsExists =
      await this.cartHelperService.validateProductVariantExists(cartItemDto);
    if (variantsExists) {
      this.logger.log('Quantity has been updated.');
      return {
        message: `Quantity has been updated`,
      };
    }

    this.logger.log('Adding new cart item to existing cart.');
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
      await this.cartHelperService.calculateTotalCartPrice(customerId);

    await this.cartRepository.update(
      { customer_id: customerId },
      {
        sub_total: total_price,
        total_price: total_price + SHIPPING_PRICE,
      },
    );
    this.logger.log('Cart item added and cart updated successfully.');
    return this.cartHelperService.addToCartMessage();
  }

  /* fetch payment information */
  fetchPaymentInformation() {
    this.logger.log('Fetching payment information.');
    const payment_methods: string[] = [
      'Esewa',
      'khalti',
      'Nabil Bank',
      'Siddhartha Bank',
      'Cash on Delivery',
    ];

    return payment_methods;
  }

  /* checkout cart service when user adds items to the cart */
  async checkoutCart(cartId: string, customerId: string) {
    this.logger.log(
      `Checking out cart for cart_id: ${cartId}, customer_id: ${customerId}`,
    );
    const payment_methods: string[] = this.fetchPaymentInformation();

    const customerCart = await this.cartHelperService.findCustomerCart(
      cartId,
      customerId,
    );

    const cartItems = await this.cartItemRepository.find({
      where: {
        cart_id: customerCart.id,
      },
    });

    await this.cartRepository.update(
      { id: customerCart?.id },
      {
        cart_status: CartStatusEnum.Processing,
      },
    );

    const processedCustomerCart = await this.cartHelperService.findCustomerCart(
      cartId,
      customerId,
    );

    this.logger.log('Cart checked out and status updated to processing.');
    return {
      data: {
        cart_id: processedCustomerCart?.id,
        cart_status: processedCustomerCart?.cart_status,
        created_at: processedCustomerCart.created_at
          .toISOString()
          .split('T')[0],
        payment_methods: payment_methods,
        cart_items: cartItems,
        shipping_fee: processedCustomerCart.shipping_price,
        sub_total: processedCustomerCart?.sub_total,
        total: processedCustomerCart?.total_price,
      },
    };
  }

  /* fetch checkout cart-details */
  async getCheckoutCartDetails(cartId: string, customerId: string) {
    this.logger.log(
      `Getting checkout cart details for cart_id: ${cartId}, customer_id: ${customerId}`,
    );
    const payment_methods: string[] = this.fetchPaymentInformation();

    const customerCart = await this.cartHelperService.findCustomerCart(
      cartId,
      customerId,
      CartStatusEnum.Processing,
    );

    const cartItemsWithImages =
      await this.cartHelperService.fetchCartItemsWithImages(cartId, customerId);

    this.logger.log('Checkout cart details fetched successfully.');
    return {
      data: {
        cart_id: customerCart?.id,
        cart_status: customerCart?.cart_status,
        created_at: customerCart.created_at.toISOString().split('T')[0],
        payment_methods: payment_methods,
        cart_items: cartItemsWithImages,
        shipping_fee: customerCart.shipping_price,
        sub_total: customerCart?.sub_total,
        total: customerCart?.total_price,
      },
    };
  }

  /* fetch all carts associated with the user */
  async getAllCarts(customerId: string) {
    this.logger.log(`Getting all carts for customer_id: ${customerId}`);
    const cart = await this.cartRepository.findOne({
      where: {
        customer_id: customerId,
        cart_status: CartStatusEnum.Pending,
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
      this.logger.log('Cart associated with the customer not found');
      return {
        message: 'No cart found associated with the customer.',
        data: [],
      };
    }

    const cartItemsWithImages =
      await this.cartHelperService.fetchCartItemsWithImages(
        cart?.id,
        customerId,
      );

    this.logger.log('All carts fetched successfully.');
    return {
      data: {
        ...cart,
        cart_items: cartItemsWithImages,
      },
    };
  }
}
