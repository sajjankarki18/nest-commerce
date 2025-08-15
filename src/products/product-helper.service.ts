import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductVariantRepository } from './repositories/product-variant.repository';
import { ProductRepository } from './repositories/product.repository';
import { ProductImage } from './entities/product-image.entity';
import { ProductImageRepository } from './repositories/product-image.repository';
import { In } from 'typeorm';
import { ProductVariantPricingRepository } from './repositories/product-variantPricing.repository';
import { ProductVariantPricing } from './entities/product-variantPricing.entity';

@Injectable()
export class ProductHelperService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    @InjectRepository(ProductVariant)
    private productVariantRepository: ProductVariantRepository,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: ProductImageRepository,
    @InjectRepository(ProductVariantPricing)
    private readonly productVariantPricingRepository: ProductVariantPricingRepository,
  ) {}

  /* helper function to fetch products and it's related variants and images on store-front */
  async fetchProductPricingDetailsAndImages(products: Product[]) {
    const productIds: string[] = products.map((product) => product.id);

    /* fetch variants */
    const variants = await this.productVariantRepository.find({
      where: {
        product_id: In(productIds),
      },
    });

    const variantIds: string[] = [
      ...new Set(variants.map((variant) => variant.id)),
    ];

    /* fetch pricing and images of the products through parallel processing */
    const [variantPricings, productImages] = await Promise.all([
      this.productVariantPricingRepository.find({
        where: {
          variant_id: In(variantIds),
        },
      }),

      this.productImageRepository.find({
        where: {
          product_id: In(productIds),
        },
      }),
    ]);

    /* map prdocut-variant for faster lookup */
    const mapVariants = new Map(
      variants.map((variant) => [variant.product_id, variant]),
    );

    /* map product-variant-pricing for faster lookup */
    const mapVariantPricing = new Map(
      variantPricings.map((pricing) => [pricing.variant_id, pricing]),
    );

    /* map product-variant-images for faster lookup */
    const mapImages = new Map(
      productImages.map((image) => [image.product_id, image]),
    );

    /* map through thr products and fetch all related products data */
    const productsWithPricingDetailAndImage = products.map((product) => {
      const variant = mapVariants.get(product?.id);
      const pricing = variant ? mapVariantPricing.get(variant?.id) : null;
      const image = mapImages.get(product?.id);

      return {
        ...product,
        image: image && {
          id: image?.id,
          image_url: image?.image_url,
          is_primary: image?.is_primary,
        },
        pricing: pricing && {
          id: pricing?.id,
          selling_price: pricing?.selling_price,
          crossed_price: pricing?.crossed_price,
        },
      };
    });

    return productsWithPricingDetailAndImage;
  }

  /* helper function to fetch product-variants (quantity) and product-images on PORTAL */
  async fetchProductVariantsQuantityAndImages(products: Product[]) {
    const productIds: string[] = products.map((product) => product.id);

    const [productVariantsQuantity, productImages] = await Promise.all([
      this.productVariantRepository.find({
        where: {
          product_id: In(productIds),
        },
      }),

      this.productImageRepository.find({
        where: {
          product_id: In(productIds),
          is_primary: true,
        },
      }),
    ]);

    /* calculate the total product-variants quantity for each product */
    const productVariantsQuantityMap = new Map<string, number>();
    for (const variantQuantity of productVariantsQuantity) {
      const currentQuantity: number =
        productVariantsQuantityMap.get(variantQuantity.product_id) ?? 0;
      productVariantsQuantityMap.set(
        variantQuantity.product_id,
        currentQuantity + variantQuantity.quantity,
      );
    }

    const productImagesMap = new Map(
      productImages.map((image) => [image.product_id, image]),
    );

    const productWithQuantityAndImage = products.map((product) => {
      const totalProductQuantity = productVariantsQuantityMap.get(product.id);
      const productImage = productImagesMap.get(product.id);

      return {
        ...product,
        quantity: totalProductQuantity ?? null,
        image_url: productImage?.image_url ?? null,
      };
    });

    return productWithQuantityAndImage;
  }
}
