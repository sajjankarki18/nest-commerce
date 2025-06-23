import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ProductService } from "./products.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { StatusEnumType } from "src/enums/StatusType.enum";
import { CreateProductVariantDto } from "./dto/create-productVariant.dto";
import { UpdateProductVariantDto } from "./dto/update-productVariant.dto";
import { CreateProductDescriptionDto } from "./dto/create-productDescription.dto";
import { UpdateProductDescriptionDto } from "./dto/update-productDescription.dto";

@ApiTags("Admin Products")
@Controller("/admin/products")
export class ProductAdminController {
  constructor(private readonly productService: ProductService) {}

  /* product-routes */
  @Post()
  createProduct(@Body() productDto: CreateProductDto) {
    return this.productService.createProduct(productDto);
  }

  @Get("/:id")
  getProductById(@Param("id") id: string) {
    return this.productService.getProductById(id);
  }

  @Get()
  getAllProducts(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query("status") status?: StatusEnumType,
  ) {
    return this.productService.getAllProducts({ page, limit, status });
  }

  @Put("/:id")
  updateProduct(@Param("id") id: string, @Body() productDto: UpdateProductDto) {
    return this.productService.updateProduct(id, productDto);
  }

  @Delete("/:id")
  deleteProduct(@Param("id") id: string) {
    return this.productService.deleteProduct(id);
  }

  /* product variant-routes */
  @Post("/product-variant")
  createProductVariant(@Body() productVariantDto: CreateProductVariantDto) {
    return this.productService.createProductVariant(productVariantDto);
  }

  @Get("/product-variant/:id")
  getProductVariantById(@Param("id") id: string) {
    return this.productService.getProductVariantById(id);
  }

  @Put("/product-variant/:id")
  updateProductVariant(
    @Param("id") id: string,
    @Body() productVariantDto: UpdateProductVariantDto,
  ) {
    return this.productService.updateProductVariant(id, productVariantDto);
  }

  @Delete("/product-variant/:id")
  deleteProductVariant(@Param("id") id: string) {
    return this.productService.deleteProductVariant(id);
  }

  /* product description-routes */
  @Post("/product-description")
  createProductDescription(
    @Body() productDescriptionDto: CreateProductDescriptionDto,
  ) {
    return this.productService.createProductDescription(productDescriptionDto);
  }

  @Get("/product-description/:id")
  getProductDescriptionById(@Param("id") id: string) {
    return this.productService.getProductDescriptionById(id);
  }

  @Put("/product-description/:id")
  updateProductDescription(
    @Param("id") id: string,
    @Body() productDescriptionDto: UpdateProductDescriptionDto,
  ) {
    return this.productService.updateProductDescription(
      id,
      productDescriptionDto,
    );
  }

  @Delete("/product-description/:id")
  deleteProductDescription(@Param("id") id: string) {
    return this.productService.deleteProductDescription(id);
  }
}
