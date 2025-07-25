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
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/product/create-product.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';
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
  createProduct(@Body() productDto: CreateProductDto) {
    return this.productService.createProduct(productDto);
  }

  @Get('/:id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Get()
  getAllProducts(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: StatusEnumType,
  ) {
    return this.productService.getAllProducts({ page, limit, status });
  }

  @Put('/:id')
  updateProduct(@Param('id') id: string, @Body() productDto: UpdateProductDto) {
    return this.productService.updateProduct(id, productDto);
  }

  @Delete('/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.deleteProduct(id);
  }

  /* product variant-routes */
  @Post('/product-variant')
  createProductVariant(@Body() productVariantDto: CreateProductVariantDto) {
    return this.productService.createProductVariant(productVariantDto);
  }

  @Get('/product-variant/:id')
  getProductVariantById(@Param('id') id: string) {
    return this.productService.getProductVariantById(id);
  }

  @Put('/product-variant/:id')
  updateProductVariant(
    @Param('id') id: string,
    @Body() productVariantDto: UpdateProductVariantDto,
  ) {
    return this.productService.updateProductVariant(id, productVariantDto);
  }

  @Delete('/product-variant/:id')
  deleteProductVariant(@Param('id') id: string) {
    return this.productService.deleteProductVariant(id);
  }

  /* product description-routes */
  @Post('/product-description')
  createProductDescription(
    @Body() productDescriptionDto: CreateProductDescriptionDto,
  ) {
    return this.productService.createProductDescription(productDescriptionDto);
  }

  @Get('/product-description/:id')
  getProductDescriptionById(@Param('id') id: string) {
    return this.productService.getProductDescriptionById(id);
  }

  @Put('/product-description/:id')
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
  deleteProductDescription(@Param('id') id: string) {
    return this.productService.deleteProductDescription(id);
  }

  /* reply to the product-question given my the customers */
  @Put('/reply/:productId')
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
