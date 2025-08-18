import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/products/entities/product-image.entity';
import { ProductImageRepository } from 'src/products/repositories/product-image.repository';
import { Cart } from './entities/cart.entity';
import { CartRepository } from './repositories/cart.repository';
import { CartItem } from './entities/cart-item.entity';
import { CartItemRepository } from './repositories/cart-item.repository';
import { CartStatusEnum } from 'src/enums/cart-status.enum';
import { In } from 'typeorm';
import { ProductVariant } from 'src/products/entities/product-variant.entity';
import { ProductVariantRepository } from 'src/products/repositories/product-variant.repository';
import { CreateCartItemDto } from './dto/create-cartItem.dto';
import { Product } from 'src/products/entities/product.entity';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { ProductVariantPricing } from 'src/products/entities/product-variantPricing.entity';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { ProductVariantPricingRepository } from 'src/products/repositories/product-variantPricing.repository';

const MAX_QUANTITY: number = 50;

@Injectable()
export class CartHelperService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: CartRepository,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: CartItemRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(ProductVariantPricing)
    private readonly productVariantPricingRepository: ProductVariantPricingRepository,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: ProductImageRepository,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: ProductVariantRepository,
    private readonly logger: Logger,
  ) {}

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

  addToCartMessage(): { message: string } {
    this.logger.log('Item has been added to cart.');
    return {
      message: `Item has been added to cart!`,
    };
  }

  /* helper function to validate cart-quantity (not greater than 50) */
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
        'You can add only upto 20 units of products in your cart.',
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

  /* get product-details associated with the items added to the cart */
  async getProductDetails(cartItemDto: CreateCartItemDto) {
    this.logger.log(
      `Fetching product details for product_id: ${cartItemDto.product_id}, variant_id: ${cartItemDto.variant_id}`,
    );
    const [product, variantPricing] = await Promise.all([
      /* fetch product-details */
      await this.productRepository.findOne({
        where: {
          id: cartItemDto?.product_id,
          status: StatusEnumType?.Published,
        },
      }),

      /* fetch product-pricing details */
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

  /* check if the variant is in stock
  ( If not then don't allow to add the item to the cart) */
  async checkVariantInStock(cartItemDto: CreateCartItemDto) {
    this.logger.log(`Checking stock for variant_id: ${cartItemDto.variant_id}`);
    const productVariant = await this.productVariantRepository.findOne({
      where: {
        id: cartItemDto.variant_id,
      },
    });

    if (productVariant?.is_availability === false) {
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

  /* calculate the total_cart_price of all items added to the cart */
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
}
