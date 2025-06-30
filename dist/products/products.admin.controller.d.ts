import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { CreateProductVariantDto } from './dto/create-productVariant.dto';
import { UpdateProductVariantDto } from './dto/update-productVariant.dto';
import { CreateProductDescriptionDto } from './dto/create-productDescription.dto';
import { UpdateProductDescriptionDto } from './dto/update-productDescription.dto';
export declare class ProductAdminController {
    private readonly productService;
    constructor(productService: ProductService);
    createProduct(productDto: CreateProductDto): Promise<import("./entities/product.entity").Product | null>;
    getProductById(id: string): Promise<import("./entities/product.entity").Product>;
    getAllProducts(page: number, limit: number, status?: StatusEnumType): Promise<{
        data: import("./entities/product.entity").Product[];
        page: number;
        limit: number;
        total: number;
    }>;
    updateProduct(id: string, productDto: UpdateProductDto): Promise<import("./entities/product.entity").Product | null>;
    deleteProduct(id: string): Promise<{
        id: string;
        message: string;
    }>;
    createProductVariant(productVariantDto: CreateProductVariantDto): Promise<import("./entities/product-variant.entity").ProductVariant>;
    getProductVariantById(id: string): Promise<import("./entities/product-variant.entity").ProductVariant>;
    updateProductVariant(id: string, productVariantDto: UpdateProductVariantDto): Promise<import("./entities/product-variant.entity").ProductVariant | null>;
    deleteProductVariant(id: string): Promise<{
        id: string;
        message: string;
    }>;
    createProductDescription(productDescriptionDto: CreateProductDescriptionDto): Promise<import("./entities/product-description.entity").ProductDescription & import("./entities/product.entity").Product>;
    getProductDescriptionById(id: string): Promise<import("./entities/product-description.entity").ProductDescription>;
    updateProductDescription(id: string, productDescriptionDto: UpdateProductDescriptionDto): Promise<import("./entities/product.entity").Product | null>;
    deleteProductDescription(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
