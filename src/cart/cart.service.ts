import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
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
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductImageRepository } from 'src/products/repositories/product-image.repository';

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
    @InjectRepository(ProductImage)
    private readonly productImageRepository: ProductImageRepository,
    private readonly logger: Logger,
  ) {}

  addToCartMessage(): { message: string } {
    this.logger.log('Item has been added to cart.');
    return {
      message: `Item has been added to cart!`,
    };
  }

  /* helper function to validate cart-quantity */
  async validateCartQuantity(cartItemDto: CreateCartItemDto) {
    this.logger.log(
      `Validating cart quantity for variant_id: ${cartItemDto.variant_id}`,
    );
    const variant = await this.productVariantRepository.findOne({
      where: {
        id: cartItemDto.variant_id,
      },
    });

    if (!variant) {
      this.logger.warn('Variant not found.');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Variant not found!`],
        error: 'Not Found',
      });
    }

    if (cartItemDto.quantity > variant.quantity) {
      this.logger.warn(
        'Requested quantity exeeds the availability of existing stock.',
      );
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: [
          `Requested quantity of ${cartItemDto.quantity} exeeds the availability of existing stock!`,
        ],
        error: 'Conflict',
      });
    }

    if (cartItemDto.quantity > MAX_QUANTITY) {
      this.logger.warn(
        'You can add only upto 50 units of products in your cart.',
      );
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['You can only add upto 50 units of products in your cart!'],
        error: 'Conflict',
      });
    }
    this.logger.log('Cart quantity validated successfully.');
  }

  /* check if the product and it's variant exists */
  async validateProductVariantExists(
    cartItemDto: CreateCartItemDto,
  ): Promise<boolean> {
    this.logger.log(
      `Checking if product variant exists in cart for variant_id: ${cartItemDto.variant_id}`,
    );
    const cartItemExists = await this.cartItemRepository.findOne({
      where: {
        variant_id: cartItemDto.variant_id,
      },
    });

    if (cartItemExists) {
      this.logger.log(
        'Product variant already exists in cart. Updating quantity.',
      );
      await this.cartItemRepository.update(
        { variant_id: cartItemDto.variant_id },
        {
          quantity: cartItemDto.quantity,
        },
      );
      return true;
    }

    this.logger.log('Product variant does not exist in cart.');
    return false;
  }

  /* get product-details */
  async getProductDetails(cartItemDto: CreateCartItemDto) {
    this.logger.log(
      `Fetching product details for product_id: ${cartItemDto.product_id}, variant_id: ${cartItemDto.variant_id}`,
    );
    const [product, variantPricing] = await Promise.all([
      await this.productRepository.findOne({
        where: {
          id: cartItemDto?.product_id,
          status: StatusEnumType?.Published,
        },
      }),
      await this.productVariantPricingRepository.findOne({
        where: {
          variant_id: cartItemDto?.variant_id,
        },
      }),
    ]);

    if (!product) {
      this.logger.warn('Product not found.');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Product with ${cartItemDto?.product_id} not found!`],
        error: 'Not Found',
      });
    }

    if (!variantPricing) {
      this.logger.warn('Variant pricing not found.');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [
          `ProductVariantPricing with ${cartItemDto?.variant_id} not found!`,
        ],
        error: 'Not Found',
      });
    }

    this.logger.log('Product details fetched successfully.');
    return {
      product: product,
      variantPricing: variantPricing,
    };
  }

  /* check if the variant in stock */
  async checkVariantInStock(cartItemDto: CreateCartItemDto) {
    this.logger.log(`Checking stock for variant_id: ${cartItemDto.variant_id}`);
    const productVariant = await this.productVariantRepository.findOne({
      where: {
        id: cartItemDto.variant_id,
      },
    });

    if (productVariant?.in_stock === false) {
      this.logger.warn('The variant is not currently in stock.');
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: [`The variant is not currently in stock!`],
        error: 'Bad Request',
      });
    }
    this.logger.log('Variant is in stock.');
    return;
  }

  /* remove the item from the cart */
  async removeCart(cartItemDto: CreateCartItemDto): Promise<boolean> {
    if (cartItemDto.quantity <= 0) {
      this.logger.log(
        `Removing cart item for variant_id: ${cartItemDto.variant_id}`,
      );
      await this.cartItemRepository.delete({
        variant_id: cartItemDto.variant_id,
      });
      return true;
    }
    return false;
  }

  /* calculate the total_cart_price */
  async calculateTotalCartPrice(customerId: string): Promise<number> {
    this.logger.log(
      `Calculating total cart price for customer_id: ${customerId}`,
    );
    const cart = await this.cartRepository.findOne({
      where: {
        customer_id: customerId,
      },
    });
    const cartItems = await this.cartItemRepository.find({
      where: { cart_id: cart?.id },
    });

    let total_price: number = 0;
    for (const cartItem of cartItems) {
      const cartPrice: number = cartItem.quantity * cartItem.selling_price;
      total_price += cartPrice;
    }
    this.logger.log(`Total cart price calculated: ${total_price}`);
    return total_price;
  }

  /* add-to-cart logic */
  async cartActions(customerId: string, cartItemDto: CreateCartItemDto) {
    this.logger.log(
      `Performing cart actions for customer_id: ${customerId}, product_id: ${cartItemDto.product_id}`,
    );
    await this.validateCartQuantity(cartItemDto);
    await this.checkVariantInStock(cartItemDto);
    const productDetails = await this.getProductDetails(cartItemDto);

    const checkCartRemoved = await this.removeCart(cartItemDto);
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

      const total_price = await this.calculateTotalCartPrice(customerId);
      await this.cartRepository.update(
        { id: savedCart.id },
        {
          sub_total: total_price,
          total_price: total_price + SHIPPING_PRICE,
        },
      );
      this.logger.log('New cart and cart item created successfully.');
      return this.addToCartMessage();
    }

    const variantsExists = await this.validateProductVariantExists(cartItemDto);
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
    const total_price: number = await this.calculateTotalCartPrice(customerId);

    await this.cartRepository.update(
      { customer_id: customerId },
      {
        sub_total: total_price,
        total_price: total_price + SHIPPING_PRICE,
      },
    );
    this.logger.log('Cart item added and cart updated successfully.');
    return this.addToCartMessage();
  }

  /* find the cart associated with the customer */
  async findCustomerCart(
    cartId: string,
    customerId: string,
    cartStatus?: CartStatusEnum,
  ) {
    this.logger.log(
      `Finding cart for cart_id: ${cartId}, customer_id: ${customerId}, cart_status: ${cartStatus}`,
    );
    const cart = await this.cartRepository.findOne({
      where: {
        id: cartId,
        customer_id: customerId,
        cart_status: cartStatus,
      },
    });

    if (!cart) {
      this.logger.warn('Cart associated with the customer not found.');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Cart with ${cartId} not found!`],
        error: 'Not Found',
      });
    }

    this.logger.log('Cart found successfully.');
    return cart;
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

    const customerCart = await this.findCustomerCart(cartId, customerId);

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

    const processedCustomerCart = await this.findCustomerCart(
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

  /* helper function to fetch cart_items with images */
  async fetchCartItemsWithImages(cartId: string, customerId: string) {
    this.logger.log(
      `Fetching cart items with images for cart_id: ${cartId}, customer_id: ${customerId}`,
    );
    const customerCart = await this.findCustomerCart(cartId, customerId);

    const cartItems = await this.cartItemRepository.find({
      where: {
        cart_id: customerCart?.id,
      },
    });

    const productIds: string[] = [
      ...new Set(cartItems.map((cartItem) => cartItem.product_id)),
    ];

    const productImages = await this.productImageRepository.find({
      where: {
        product_id: In(productIds),
        is_primary: true,
      },
    });

    this.logger.log(
      `Fetched ${productImages.length} product images for cart items.`,
    );

    const productImagesMap = new Map(
      productImages.map((image) => [image.product_id, image]),
    );

    const cartItemsWithImages = cartItems.map((cartItem) => {
      const productImage = productImagesMap.get(cartItem.product_id);
      return {
        ...cartItem,
        image_url: productImage?.image_url,
      };
    });

    this.logger.log('Cart items with images fetched successfully.');
    return cartItemsWithImages;
  }

  /* fetch checkout cart-details */
  async getCheckoutCartDetails(cartId: string, customerId: string) {
    this.logger.log(
      `Getting checkout cart details for cart_id: ${cartId}, customer_id: ${customerId}`,
    );
    const payment_methods: string[] = this.fetchPaymentInformation();

    const customerCart = await this.findCustomerCart(
      cartId,
      customerId,
      CartStatusEnum.Processing,
    );

    const cartItemsWithImages = await this.fetchCartItemsWithImages(
      cartId,
      customerId,
    );

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
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['No cart found associated with the customer!'],
        error: 'Not Found',
      });
    }

    const cartItemsWithImages = await this.fetchCartItemsWithImages(
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
