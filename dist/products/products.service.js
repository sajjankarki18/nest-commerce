"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("./entities/product.entity");
const product_repository_1 = require("./repositories/product.repository");
const product_description_entity_1 = require("./entities/product-description.entity");
const product_variant_entity_1 = require("./entities/product-variant.entity");
const product_variant_repository_1 = require("./repositories/product-variant.repository");
const product_description_repository_1 = require("./repositories/product-description.repository");
const product_variantPricing_entity_1 = require("./entities/product-variantPricing.entity");
const slugify_1 = require("slugify");
const StatusType_enum_1 = require("../enums/StatusType.enum");
const typeorm_2 = require("typeorm");
const product_variantPricing_repository_1 = require("./repositories/product-variantPricing.repository");
const product_image_entity_1 = require("./entities/product-image.entity");
const product_image_repository_1 = require("./repositories/product-image.repository");
let ProductService = class ProductService {
    logger;
    productRepository;
    productDescriptionRepository;
    productVariantRepository;
    productVariantPricingRepository;
    productImageRepository;
    constructor(logger, productRepository, productDescriptionRepository, productVariantRepository, productVariantPricingRepository, productImageRepository) {
        this.logger = logger;
        this.productRepository = productRepository;
        this.productDescriptionRepository = productDescriptionRepository;
        this.productVariantRepository = productVariantRepository;
        this.productVariantPricingRepository = productVariantPricingRepository;
        this.productImageRepository = productImageRepository;
    }
    async getAllProductsStoreFront({ page, limit, }) {
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            throw new common_1.ConflictException({
                statusCode: common_1.HttpStatus.CONFLICT,
                message: ['Page and limit should be of positive integers!'],
                error: 'Conflict',
            });
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [products, totalProducts] = await this.productRepository.findAndCount({
            where: {
                status: StatusType_enum_1.StatusEnumType.Published,
            },
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
            select: ['id', 'title', 'slug', 'category_id', 'status'],
        });
        const variants = await this.productVariantRepository.find({
            where: {
                product_id: (0, typeorm_2.In)(products.map((product) => product.id)),
            },
        });
        const mapVariants = new Map(variants.map((variant) => [variant.product_id, variant]));
        const variantPricings = await this.productVariantPricingRepository.find({
            where: {
                variant_id: (0, typeorm_2.In)(variants.map((variant) => variant.id)),
            },
        });
        const mapVariantPricing = new Map(variantPricings.map((pricing) => [pricing.variant_id, pricing]));
        const productImages = await this.productImageRepository.find({
            where: {
                product_id: (0, typeorm_2.In)(products.map((product) => product.id)),
            },
        });
        const mapImages = new Map(productImages.map((image) => [image.product_id, image]));
        const productsData = products.map((product) => {
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
        return {
            data: productsData,
            page: page,
            limit: newLimit,
            total: totalProducts,
        };
    }
    async getProductsBySlug(slug) {
        const product = await this.productRepository.findOne({
            where: {
                slug: slug,
                status: StatusType_enum_1.StatusEnumType.Published,
            },
            select: [
                'id',
                'title',
                'short_description',
                'slug',
                'status',
                'category_id',
            ],
        });
        if (!product) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`Product with ${slug} not found!`],
                error: 'Not Found',
            });
        }
        const [productVariants, productImages] = await Promise.all([
            await this.productVariantRepository.find({
                where: {
                    product_id: product?.id,
                },
                select: [
                    'id',
                    'variant_title',
                    'quantity',
                    'in_stock',
                    'size',
                    'color',
                ],
            }),
            await this.productImageRepository.find({
                where: {
                    product_id: product?.id,
                },
            }),
        ]);
        return {
            ...product,
            variants: productVariants,
            images: productImages,
        };
    }
    async createProduct(productDto) {
        try {
            const product = this.productRepository.create({
                title: productDto.title,
                slug: productDto.slug,
                status: productDto.status,
                category_id: productDto.category_id,
            });
            this.logger.log('product has been created!');
            const savedProduct = await this.productRepository.save(product);
            if (savedProduct?.title) {
                const productSlug = (0, slugify_1.default)(savedProduct.title, {
                    strict: true,
                    lower: true,
                });
                await this.productRepository.update(savedProduct.id, {
                    slug: productSlug,
                });
            }
            return await this.productRepository.findOne({
                where: { id: savedProduct.id },
            });
        }
        catch (error) {
            this.logger.error('some error occurred while creating a new product!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new product, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getProductById(id) {
        const product = await this.productRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!product) {
            this.logger.warn('product not found!');
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`product with the ${id} not found`],
                error: 'Not Found!',
            });
        }
        this.logger.log('product has been found');
        return product;
    }
    async getAllProducts({ page, limit, status, }) {
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            throw new common_1.ConflictException({
                statusCode: common_1.HttpStatus.CONFLICT,
                message: ['page and limit should be of positive integers!'],
                error: 'Conflict',
            });
        }
        let filteredStatus;
        if (status?.trim().toLowerCase() === '') {
            filteredStatus = (0, typeorm_2.In)([StatusType_enum_1.StatusEnumType.Published, StatusType_enum_1.StatusEnumType.Draft]);
        }
        else {
            if (status?.trim().toLowerCase() === StatusType_enum_1.StatusEnumType.Published) {
                filteredStatus = StatusType_enum_1.StatusEnumType.Published;
            }
            else {
                filteredStatus = StatusType_enum_1.StatusEnumType.Draft;
            }
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [products, totalProducts] = await this.productRepository.findAndCount({
            where: {
                status: filteredStatus,
            },
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
        });
        this.logger.log(`logger fetched successfully!`);
        return {
            data: products,
            page: page,
            limit: newLimit,
            total: totalProducts,
        };
    }
    async updateProduct(id, productDto) {
        const product = await this.getProductById(id);
        try {
            let productSlug = productDto.title;
            if (productDto.title && productDto.title !== product.title) {
                productSlug = (0, slugify_1.default)(productDto.title, {
                    strict: true,
                    lower: true,
                });
            }
            await this.productRepository.update({ id: id }, {
                title: productDto.title,
                slug: productSlug,
                status: productDto.status,
                category_id: productDto.category_id,
            });
            this.logger.log('product has been updated!');
            return await this.productRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('some error occurred while updating the product!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new product, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteProduct(id) {
        await this.getProductById(id);
        try {
            await this.productRepository.delete(id);
            this.logger.log('product has been deleted');
            return {
                id: `${id}`,
                message: `product has been deleted`,
            };
        }
        catch (error) {
            this.logger.error('some error occurred while deleting the product!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting a new product, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async validateProduct(productVariantDto) {
        const product = await this.productRepository.findOne({
            where: {
                id: productVariantDto.product_id,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`product with ${productVariantDto.product_id} not found`],
                error: 'product not found',
            });
        }
    }
    async createProductVariant(productVariantDto) {
        await this.validateProduct(productVariantDto);
        try {
            const product_variant = this.productVariantRepository.create({
                variant_title: productVariantDto.variant_title,
                quantity: productVariantDto.quantity,
                product_id: productVariantDto.product_id,
                in_stock: productVariantDto.in_stock,
            });
            this.logger.log('product_variant has been added!');
            return await this.productVariantRepository.save(product_variant);
        }
        catch (error) {
            this.logger.error('some error occurred while creating a new product variant!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new product variant, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getProductVariantById(id) {
        const variant = await this.productVariantRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!variant) {
            this.logger.error(`product variant not found`);
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`product_variant with ${id} not found!`],
                error: 'Not Found',
            });
        }
        this.logger.log('product_variant has been fetched successfully!');
        return variant;
    }
    async updateProductVariant(id, productVariantDto) {
        await this.getProductVariantById(id);
        try {
            await this.productVariantRepository.update({ id: id }, {
                variant_title: productVariantDto.variant_title,
                quantity: productVariantDto.quantity,
                in_stock: productVariantDto.in_stock,
                product_id: productVariantDto.product_id,
            });
            this.logger.log('product_variant has been updated successfully!');
            return await this.productVariantRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('some error occurred while updating a new product variant!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating a new product variant, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteProductVariant(id) {
        await this.getProductVariantById(id);
        try {
            await this.productVariantRepository.delete(id);
            this.logger.log('product variant has been deleted!');
            return {
                id: `${id}`,
                message: 'product_variant has been deleted',
            };
        }
        catch (error) {
            this.logger.error('some error occurred while deleting a new product variant!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating a new product variant, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async createProductDescription(productDescriptionDto) {
        try {
            const product_description = this.productDescriptionRepository.create({
                description: productDescriptionDto.description,
                product_id: productDescriptionDto.product_id,
            });
            this.logger.log('product_description has been created!');
            return await this.productRepository.save(product_description);
        }
        catch (error) {
            this.logger.error('some error occurred while creating a new product description!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new product description, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getProductDescriptionById(id) {
        const product_description = await this.productDescriptionRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!product_description) {
            this.logger.warn('product_desc not found!');
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`product_desc with the ${id} not found`],
                error: 'Not Found!',
            });
        }
        this.logger.log('product_desc has been found');
        return product_description;
    }
    async updateProductDescription(id, productDescriptionDto) {
        await this.getProductDescriptionById(id);
        try {
            await this.productDescriptionRepository.update({ id: id }, {
                description: productDescriptionDto.description,
                product_id: productDescriptionDto.product_id,
            });
            this.logger.log('product_desc has been updated!');
            return await this.productRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('some error occurred while updating the product_description!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new product_Description, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteProductDescription(id) {
        await this.getProductDescriptionById(id);
        try {
            await this.productDescriptionRepository.delete(id);
            this.logger.log('product_desc has been deleted');
            return {
                id: `${id}`,
                message: `product_desc has been deleted`,
            };
        }
        catch (error) {
            this.logger.error('some error occurred while deleting the product_desc!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting a new product_desc, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(product_description_entity_1.ProductDescription)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(4, (0, typeorm_1.InjectRepository)(product_variantPricing_entity_1.ProductVariantPricing)),
    __param(5, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __metadata("design:paramtypes", [common_1.Logger,
        product_repository_1.ProductRepository,
        product_description_repository_1.ProductDescriptionRepository,
        product_variant_repository_1.ProductVariantRepository,
        product_variantPricing_repository_1.ProductVariantPricingRepository,
        product_image_repository_1.ProductImageRepository])
], ProductService);
//# sourceMappingURL=products.service.js.map