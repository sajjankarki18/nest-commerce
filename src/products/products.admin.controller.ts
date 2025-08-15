import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ProductService } from './products.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/product/create-product.dto';
import { CreateProductVariantDto } from './dto/product-variant/create-productVariant.dto';
import { CreateProductDescriptionDto } from './dto/product-description/create-productDescription.dto';
import { UpdateProductDto } from './dto/product/update-product.dto';
import { UpdateProductVariantDto } from './dto/product-variant/update-productVariant.dto';
import { UpdateProductDescriptionDto } from './dto/product-description/update-productDescription.dto';
import { ReplyProductDto } from './dto/question/reply-productQuestion.dto';

@ApiTags('Admin Products')
@Controller('/admin/products')
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  /* product-routes */
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  createProduct(@Body() productDto: CreateProductDto) {
    return this.productService.createProduct(productDto);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Product fetched successfully.' })
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Products list fetched successfully.',
  })
  getAllProducts(@Query('page') page: number, @Query('limit') limit: number) {
    return this.productService.getAllProducts({ page, limit });
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  updateProduct(@Param('id') id: string, @Body() productDto: UpdateProductDto) {
    return this.productService.updateProduct(id, productDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  /* product variant-routes */
  @Post('/product-variant')
  @ApiOperation({ summary: 'Create a new product variant' })
  @ApiResponse({
    status: 201,
    description: 'Product variant created successfully.',
  })
  createProductVariant(@Body() productVariantDto: CreateProductVariantDto) {
    return this.productService.createProductVariant(productVariantDto);
  }

  @Get('/product-variant/:id')
  @ApiOperation({ summary: 'Get product variant by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product variant fetched successfully.',
  })
  getProductVariantById(@Param('id') id: string) {
    return this.productService.getProductVariantById(id);
  }

  @Put('/product-variant/:id')
  @ApiOperation({ summary: 'Update product variant by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product variant updated successfully.',
  })
  updateProductVariant(
    @Param('id') id: string,
    @Body() productVariantDto: UpdateProductVariantDto,
  ) {
    return this.productService.updateProductVariant(id, productVariantDto);
  }

  @Delete('/product-variant/:id')
  @ApiOperation({ summary: 'Delete product variant by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product variant deleted successfully.',
  })
  deleteProductVariant(@Param('id') id: string) {
    return this.productService.deleteProductVariant(id);
  }

  /* product description-routes */
  @Post('/product-description')
  @ApiOperation({ summary: 'Create a new product description' })
  @ApiResponse({
    status: 201,
    description: 'Product description created successfully.',
  })
  createProductDescription(
    @Body() productDescriptionDto: CreateProductDescriptionDto,
  ) {
    return this.productService.createProductDescription(productDescriptionDto);
  }

  @Get('/product-description/:id')
  @ApiOperation({ summary: 'Get product description by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product description fetched successfully.',
  })
  getProductDescriptionById(@Param('id') id: string) {
    return this.productService.getProductDescriptionById(id);
  }

  @Put('/product-description/:id')
  @ApiOperation({ summary: 'Update product description by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product description updated successfully.',
  })
  updateProductDescription(
    @Param('id') id: string,
    @Body() productDescriptionDto: UpdateProductDescriptionDto,
  ) {
    return this.productService.updateProductDescription(
      id,
      productDescriptionDto,
    );
  }

  @Delete('/product-description/:id')
  @ApiOperation({ summary: 'Delete product description by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'Product description deleted successfully.',
  })
  deleteProductDescription(@Param('id') id: string) {
    return this.productService.deleteProductDescription(id);
  }

  /* reply to the product-question given by the customers */
  @Put('/reply/:productId')
  @ApiOperation({ summary: 'Reply to a customer product question' })
  @ApiParam({ name: 'productId', type: String })
  @ApiResponse({
    status: 200,
    description: 'Replied to product question successfully.',
  })
  replyQuestion(
    @Param('productId') productId: string,
    @Body() replyProductDto: ReplyProductDto,
    @Req() req: { user: { userId: string } },
  ) {
    const admin_user_id: string = req.user?.userId;
    return this.productService.replyQuestion(
      productId,
      replyProductDto,
      admin_user_id,
    );
  }
}
