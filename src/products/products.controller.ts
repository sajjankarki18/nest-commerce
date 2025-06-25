import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './products.service';

@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /* get all products for store_front */
  @Get('/all-products')
  getAllProductsStoreFront(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.productService.getAllProductsStoreFront({ page, limit });
  }

  /* get products by slug */
  @Get('/:slug')
  getProductsBySlug(@Param('slug') slug: string) {
    return this.productService.getProductsBySlug(slug);
  }
}
