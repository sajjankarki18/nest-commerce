import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Products store') // Group name in Swagger UI
@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get all products for the store front
   */
  @Get('/all-products')
  @ApiOperation({
    summary: 'Get all products (store front)',
    description:
      'Fetches a paginated list of all products available for the store front.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: true,
    description: 'Page number (must be a positive integer)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: true,
    description: 'Number of products per page (max 10)',
    example: 10,
  })
  getAllProductsStoreFront(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.productService.getAllProductsStoreFront({ page, limit });
  }

  /**
   * Get product details by slug
   */
  @Get('/:slug')
  @ApiOperation({
    summary: 'Get product details by slug',
    description: 'Fetches detailed information about a product using its slug.',
  })
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
    description: 'The slug of the product',
    example: 'cool-running-shoes',
  })
  getProductsBySlug(@Param('slug') slug: string) {
    return this.productService.getProductsBySlug(slug);
  }

  /**
   * Get similar products
   */
  @Get('/similar-products/:slug')
  @ApiOperation({
    summary: 'Get similar products',
    description:
      'Fetches a list of products that are similar to the given product slug.',
  })
  @ApiParam({
    name: 'slug',
    type: String,
    required: true,
    description: 'The slug of the product to find similar products for',
    example: 'cool-running-shoes',
  })
  getSimilarProducts(@Param('slug') slug: string) {
    return this.productService.getSimilarProducts(slug);
  }
}
