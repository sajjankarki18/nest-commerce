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
exports.CollectionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const collection_repository_1 = require("./repositories/collection.repository");
const collection_redirect_entity_1 = require("./entities/collection-redirect.entity");
const collection_redirect_repository_1 = require("./repositories/collection-redirect.repository");
const collection_entity_1 = require("./entities/collection.entity");
const slugify_1 = require("slugify");
const StatusType_enum_1 = require("../enums/StatusType.enum");
const product_entity_1 = require("../products/entities/product.entity");
const product_repository_1 = require("../products/repositories/product.repository");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const product_variant_repository_1 = require("../products/repositories/product-variant.repository");
const product_variantPricing_entity_1 = require("../products/entities/product-variantPricing.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
const product_image_repository_1 = require("../products/repositories/product-image.repository");
const product_variantPricing_repository_1 = require("../products/repositories/product-variantPricing.repository");
const collection_redirectType_enum_1 = require("./types/collection-redirectType.enum");
const typeorm_2 = require("typeorm");
let CollectionsService = class CollectionsService {
    collectionRepository;
    collectionRedirectRepository;
    productRepository;
    productVariantRepository;
    productVariantPricingRepository;
    productImageRepository;
    logger;
    constructor(collectionRepository, collectionRedirectRepository, productRepository, productVariantRepository, productVariantPricingRepository, productImageRepository, logger) {
        this.collectionRepository = collectionRepository;
        this.collectionRedirectRepository = collectionRedirectRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productVariantPricingRepository = productVariantPricingRepository;
        this.productImageRepository = productImageRepository;
        this.logger = logger;
    }
    async getMappedProductData(products) {
        const productIds = products.map((product) => product.id);
        const productVariants = await this.productVariantRepository.find({
            where: {
                product_id: (0, typeorm_2.In)(productIds),
            },
        });
        const mappedProductVariants = new Map(productVariants.map((productVariant) => [
            productVariant.product_id,
            productVariant,
        ]));
        const productVariantIds = productVariants.map((productvariant) => productvariant.id);
        const productVariantPricing = await this.productVariantPricingRepository.find({
            where: {
                variant_id: (0, typeorm_2.In)(productVariantIds),
            },
        });
        const mappedProductVariantPricing = new Map(productVariantPricing.map((productVariantPricing) => [
            productVariantPricing.variant_id,
            productVariantPricing,
        ]));
        const productImages = await this.productImageRepository.find({
            where: {
                product_id: (0, typeorm_2.In)(productIds),
            },
        });
        const mappedProductImages = new Map(productImages.map((productImage) => [
            productImage.product_id,
            productImage,
        ]));
        return products.map((product) => {
            const productVariant = mappedProductVariants.get(product.id);
            const productVariantPricing = productVariant
                ? mappedProductVariantPricing.get(productVariant.id)
                : null;
            const productImage = mappedProductImages.get(product.id);
            return {
                ...product,
                image: productImage && {
                    id: productImage?.id,
                    image_url: productImage?.image_url,
                    is_primary: productImage?.is_primary,
                },
                product_pricing: productVariantPricing && {
                    id: productVariantPricing?.id,
                    selling_price: productVariantPricing?.selling_price,
                    crossed_price: productVariantPricing?.crossed_price,
                },
            };
        });
    }
    async getCollectionsBySlug(slug) {
        const collection = await this.collectionRepository.findOne({
            where: {
                slug: slug,
                status: StatusType_enum_1.StatusEnumType.Published,
            },
        });
        if (!collection) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`collection with slug ${slug} not found!`],
                error: 'Not Found',
            });
        }
        const collectionRedirects = await this.collectionRedirectRepository.find({
            where: {
                collection_id: collection.id,
            },
        });
        const redirectIds = collectionRedirects.map((redirect) => redirect.redirect_id);
        const productsData = await Promise.all(collectionRedirects.map(async (redirect) => {
            const products = [];
            if (collection_redirectType_enum_1.CollectionRedirectTypeEnum.Product === redirect.redirect_type) {
                const collectionProduct = await this.productRepository.findOne({
                    where: {
                        id: (0, typeorm_2.In)(redirectIds),
                        status: StatusType_enum_1.StatusEnumType.Published,
                    },
                    select: ['id', 'title', 'slug', 'category_id'],
                });
                if (collectionProduct) {
                    products.push(collectionProduct);
                }
            }
            else if (collection_redirectType_enum_1.CollectionRedirectTypeEnum.Category === redirect.redirect_type) {
                const collectionProducts = await this.productRepository.find({
                    where: {
                        status: StatusType_enum_1.StatusEnumType.Published,
                        category_id: (0, typeorm_2.In)(redirectIds),
                    },
                    select: ['id', 'title', 'slug', 'category_id'],
                });
                products.push(...collectionProducts);
            }
            const mappedProductsData = await this.getMappedProductData(products);
            return mappedProductsData;
        }));
        return {
            data: productsData.flat(),
        };
    }
    async createCollection(collectionDto) {
        try {
            const collection = this.collectionRepository.create({
                title: collectionDto.title,
                slug: collectionDto.slug,
                image_url: collectionDto.image_url,
                status: collectionDto.status,
            });
            const savedCollection = await this.collectionRepository.save(collection);
            if (savedCollection?.title) {
                const updatedCollectionSlug = (0, slugify_1.default)(savedCollection.title, {
                    strict: true,
                    lower: true,
                });
                await this.collectionRepository.update(savedCollection.id, {
                    slug: updatedCollectionSlug,
                });
            }
            return await this.collectionRepository.findOne({
                where: {
                    id: savedCollection.id,
                },
            });
        }
        catch (error) {
            this.logger.error('some error occurred while creating the banner!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a collection, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getCollectionById(id) {
        const collection = await this.collectionRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!collection) {
            this.logger.error('collection not found!');
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`collection with ${id} not found`],
                error: 'Not Found',
            });
        }
        this.logger.log('collection fetched successfully!');
        return collection;
    }
    async getAllCollections() {
        try {
            const banners = await this.collectionRepository.find();
            const totalBanners = banners.length;
            this.logger.log('banners fetched successfully!');
            return {
                data: banners,
                total: totalBanners,
            };
        }
        catch (error) {
            this.logger.error('some error occurred while fetching the banners!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while fetching all banners, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async updateCollection(id, collectionDto) {
        await this.getCollectionById(id);
        try {
            await this.collectionRepository.update({ id }, {
                title: collectionDto.title,
                slug: collectionDto.slug,
                image_url: collectionDto.image_url,
                status: collectionDto.status,
            });
            this.logger.log('collectionhas been updated!');
            return await this.collectionRepository.findOne({
                where: { id },
            });
        }
        catch (error) {
            this.logger.error('some error occurred while updating the banner!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating a banner, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteCollection(id) {
        await this.getCollectionById(id);
        try {
            await this.collectionRepository.delete(id);
            this.logger.log('collectionhas been deleted!');
            return {
                id: `${id}`,
                message: 'collection deleted successfully!',
            };
        }
        catch (error) {
            this.logger.error('some error occurred while deleting the banner!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting a banner, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async validateCollectionData(collectionId) {
        const collection = await this.collectionRepository.findOne({
            where: {
                id: collectionId,
            },
        });
        if (!collection) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`collection with ${collectionId} not found!`],
                error: 'Not Found',
            });
        }
    }
    async createCollectionRedirect(collectionRedirectDto) {
        await this.validateCollectionData(collectionRedirectDto.collection_id);
        try {
            const collectionRedirect = this.collectionRedirectRepository.create({
                collection_id: collectionRedirectDto.collection_id,
                redirect_id: collectionRedirectDto.redirect_id,
                redirect_type: collectionRedirectDto.redirect_type,
            });
            this.logger.log('created new collection-redirect');
            return await this.collectionRedirectRepository.save(collectionRedirect);
        }
        catch (error) {
            this.logger.error('some error occurred while creating a new collection-redirect', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new collection-redirect, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getCollectionRedirectById(id) {
        const redirect = await this.collectionRedirectRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!redirect) {
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`redirect with ${id} not found!`],
                error: 'Not Found',
            });
        }
        return redirect;
    }
    async updateCollectionRedirect(id, collectionRedirectDto) {
        await this.getCollectionRedirectById(id);
        try {
            await this.collectionRedirectRepository.update({ id }, {
                collection_id: collectionRedirectDto.collection_id,
                redirect_id: collectionRedirectDto.redirect_id,
                redirect_type: collectionRedirectDto.redirect_type,
            });
            return await this.collectionRedirectRepository.findOne({ where: { id } });
        }
        catch (error) {
            this.logger.error('some error occurred while updating a collection-redirect', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while updating a collection, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async deleteCollectionRedirect(id) {
        await this.getCollectionRedirectById(id);
        try {
            await this.collectionRedirectRepository.delete(id);
            return {
                id: `${id}`,
                message: `collection-redirect deleted`,
            };
        }
        catch (error) {
            this.logger.error('some error occurred while deleting a collection-redirect', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while deleting a collection, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
};
exports.CollectionsService = CollectionsService;
exports.CollectionsService = CollectionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(collection_entity_1.Collection)),
    __param(1, (0, typeorm_1.InjectRepository)(collection_redirect_entity_1.CollectionRedirect)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(4, (0, typeorm_1.InjectRepository)(product_variantPricing_entity_1.ProductVariantPricing)),
    __param(5, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __metadata("design:paramtypes", [collection_repository_1.CollectionRepository,
        collection_redirect_repository_1.CollectionRedirectRepository,
        product_repository_1.ProductRepository,
        product_variant_repository_1.ProductVariantRepository,
        product_variantPricing_repository_1.ProductVariantPricingRepository,
        product_image_repository_1.ProductImageRepository,
        common_1.Logger])
], CollectionsService);
//# sourceMappingURL=collections.service.js.map