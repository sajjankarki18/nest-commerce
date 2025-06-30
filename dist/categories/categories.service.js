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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./entities/category.entity");
const category_repository_1 = require("./repositories/category.repository");
const StatusType_enum_1 = require("../enums/StatusType.enum");
const slugify_1 = require("slugify");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../products/entities/product.entity");
const product_repository_1 = require("../products/repositories/product.repository");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const product_variant_repository_1 = require("../products/repositories/product-variant.repository");
const product_variantPricing_entity_1 = require("../products/entities/product-variantPricing.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
const product_image_repository_1 = require("../products/repositories/product-image.repository");
const product_variantPricing_repository_1 = require("../products/repositories/product-variantPricing.repository");
let CategoriesService = class CategoriesService {
    categoryRepository;
    productRepository;
    productVariantRepository;
    productVariantPricingRepository;
    productImageRepository;
    logger;
    constructor(categoryRepository, productRepository, productVariantRepository, productVariantPricingRepository, productImageRepository, logger) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productVariantRepository = productVariantRepository;
        this.productVariantPricingRepository = productVariantPricingRepository;
        this.productImageRepository = productImageRepository;
        this.logger = logger;
    }
    async getAllParentCategories() {
        try {
            const [parentCategories, totalParentCategories] = await this.categoryRepository.findAndCount({
                where: {
                    parent_id: (0, typeorm_2.IsNull)(),
                    status: StatusType_enum_1.StatusEnumType.Published,
                },
            });
            return {
                data: parentCategories,
                total: totalParentCategories,
            };
        }
        catch (error) {
            this.logger.error('some error occurred while fetching parent_categories!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    `some error occurred while fetching parent_categories, please try again`,
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async fetchCategory(id) {
        const category = await this.categoryRepository.find({
            where: {
                status: StatusType_enum_1.StatusEnumType.Published,
                parent_id: id,
            },
            select: ['id', 'parent_id', 'name', 'description', 'slug'],
        });
        return category;
    }
    async getAllCategoriesForStore() {
        try {
            const firstLevelCategories = await this.categoryRepository.find({
                where: {
                    status: StatusType_enum_1.StatusEnumType.Published,
                    parent_id: (0, typeorm_2.IsNull)(),
                },
                select: ['id', 'parent_id', 'name', 'description', 'slug'],
            });
            const categoriesData = await Promise.all(firstLevelCategories.map(async (firstLevelCategory) => {
                const secondLevelCategories = await this.fetchCategory(firstLevelCategory?.id);
                const mappedSecondLevelSubCategories = await Promise.all(secondLevelCategories.map(async (secondLevelCategory) => {
                    const thirdLevelCategories = await this.fetchCategory(secondLevelCategory?.id);
                    return {
                        ...secondLevelCategory,
                        third_level: thirdLevelCategories,
                    };
                }));
                return {
                    ...firstLevelCategory,
                    second_level: mappedSecondLevelSubCategories,
                };
            }));
            return {
                data: categoriesData,
            };
        }
        catch (error) {
            this.logger.log('server error occurred', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while fetching the category, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getAllCategoryProductsBySlug(slug) {
        const category = await this.categoryRepository.findOne({
            where: {
                slug: slug,
            },
        });
        if (!category) {
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [`category with slug ${slug} not found!`],
                error: 'Not Found',
            });
        }
        const products = await this.productRepository.find({
            where: {
                category_id: category?.id,
                status: StatusType_enum_1.StatusEnumType.Published,
            },
            select: ['id', 'title', 'short_description', 'slug', 'category_id'],
        });
        const productVariants = await this.productVariantRepository.find({
            where: {
                product_id: (0, typeorm_2.In)(products.map((product) => product.id)),
            },
        });
        const mapProductVariants = new Map(productVariants.map((variant) => [variant.product_id, variant]));
        const productVariantsPricing = await this.productVariantPricingRepository.find({
            where: {
                variant_id: (0, typeorm_2.In)(productVariants.map((variant) => variant.id)),
            },
        });
        const mapProductVariantsPricing = new Map(productVariantsPricing.map((variantPricing) => [
            variantPricing.variant_id,
            variantPricing,
        ]));
        const productImages = await this.productImageRepository.find({
            where: {
                product_id: (0, typeorm_2.In)(products.map((product) => product.id)),
            },
        });
        const mapProductImages = new Map(productImages.map((image) => [image.product_id, image]));
        const productsData = products.map((product) => {
            const variant = mapProductVariants.get(product?.id);
            const pricing = variant
                ? mapProductVariantsPricing.get(variant?.id)
                : null;
            const image = mapProductImages.get(product?.id);
            return {
                ...product,
                product_pricing: pricing && {
                    id: pricing?.id,
                    selling_price: pricing?.selling_price,
                    crossed_price: pricing?.crossed_price,
                },
                image: image && {
                    id: image?.id,
                    image_url: image?.image_url,
                    is_primary: image?.is_primary,
                },
            };
        });
        return {
            data: productsData,
        };
    }
    async categoryHeirarchyUpdation(categoryDto) {
        if (categoryDto?.parent_id) {
            const child_category = await this.categoryRepository.findOne({
                where: {
                    id: categoryDto.parent_id,
                },
            });
            if (child_category?.parent_id) {
                const parent_category = await this.categoryRepository.findOne({
                    where: {
                        id: child_category.parent_id,
                    },
                });
                if (parent_category?.parent_id) {
                    const grand_parent_category = await this.categoryRepository.findOne({
                        where: {
                            id: parent_category.parent_id,
                        },
                    });
                    if (grand_parent_category) {
                        this.logger.warn(`category can be updated only upto three levels!`);
                        throw new common_1.ConflictException({
                            statusCode: common_1.HttpStatus.CONFLICT,
                            message: ['category can be only updated upto three levels!'],
                            error: 'Conflict',
                        });
                    }
                }
            }
        }
    }
    async createCategory(categoryDto) {
        try {
            const category = this.categoryRepository.create({
                parent_id: categoryDto.parent_id,
                description: categoryDto.description,
                name: categoryDto.name,
                status: categoryDto.status,
            });
            const savedCategory = await this.categoryRepository.save(category);
            if (savedCategory?.name) {
                const categorySlug = (0, slugify_1.default)(savedCategory.name, {
                    strict: true,
                    lower: true,
                });
                await this.categoryRepository.update(savedCategory.id, {
                    slug: categorySlug,
                });
            }
            this.logger.log('category has been created!');
            return await this.categoryRepository.findOne({
                where: { id: savedCategory.id },
            });
        }
        catch (error) {
            this.logger.error('some error occurred while creating the category!', error);
            throw new common_1.InternalServerErrorException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    'some error occurred while creating a new category, please try again!',
                ],
                error: 'Internal Server Error',
            });
        }
    }
    async getAllCategories({ page, limit, status, }) {
        if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
            this.logger.error('page and limit should be of positive integers!');
            throw new common_1.ConflictException({
                statusCode: common_1.HttpStatus.CONFLICT,
                message: ['page and limit must be of positive integers!'],
                error: 'Conflict',
            });
        }
        let filterStatus;
        if (status?.trim().toLowerCase() === '') {
            filterStatus = (0, typeorm_2.In)([StatusType_enum_1.StatusEnumType.Published, StatusType_enum_1.StatusEnumType.Draft]);
        }
        else {
            if (status?.trim().toLowerCase() === StatusType_enum_1.StatusEnumType.Published) {
                filterStatus = StatusType_enum_1.StatusEnumType.Published;
            }
            else {
                filterStatus = StatusType_enum_1.StatusEnumType.Draft;
            }
        }
        const newLimit = limit > 10 ? 10 : limit;
        const [categories, totalCategories] = await this.categoryRepository.findAndCount({
            where: {
                status: filterStatus,
            },
            skip: (page - 1) * newLimit,
            take: newLimit,
            order: { created_at: 'desc' },
        });
        this.logger.log('categories fetched successfully!');
        return {
            data: categories,
            page: page,
            limit: newLimit,
            total: totalCategories,
        };
    }
    async getCategoryById(id) {
        const category = await this.categoryRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!category) {
            this.logger.error('category not found!');
            throw new common_1.NotFoundException({
                statusCode: common_1.HttpStatus.NOT_FOUND,
                message: [`category with ${id} not found!`],
                error: 'Not Found',
            });
        }
        this.logger.log('categories fetched successfully');
        return category;
    }
    async updateCategory(id, categoryDto) {
        const category = await this.getCategoryById(id);
        await this.categoryHeirarchyUpdation(categoryDto);
        let updatedCategorySlug = category?.name;
        if (categoryDto.name && category.name !== categoryDto.name) {
            updatedCategorySlug = (0, slugify_1.default)(categoryDto.name, {
                lower: true,
                strict: true,
            });
        }
        await this.categoryRepository.update({ id }, {
            parent_id: categoryDto.parent_id,
            name: categoryDto.name,
            description: categoryDto.description,
            slug: updatedCategorySlug,
            status: categoryDto.status,
        });
        this.logger.log(`category has been updated!`);
        return await this.categoryRepository.findOne({ where: { id } });
    }
    async deleteCategory(id) {
        const category = await this.getCategoryById(id);
        if (category.parent_id === null) {
            const child_categories = await this.categoryRepository.find({
                where: {
                    parent_id: category.id,
                },
            });
            if (child_categories.length > 0) {
                this.logger.warn(`cannot delete category, child categories exists within it!`);
                throw new common_1.ConflictException({
                    statusCode: common_1.HttpStatus.CONFLICT,
                    message: [
                        'category cannot not be deleted, it has existing child categories!',
                    ],
                    error: 'Conflict',
                });
            }
        }
        else if (category.parent_id !== null) {
            const grand_child_categories = await this.categoryRepository.find({
                where: {
                    parent_id: category.id,
                },
            });
            if (grand_child_categories.length > 0) {
                this.logger.warn(`cannot delete category, child categories exists within it!`);
                throw new common_1.ConflictException({
                    statusCode: common_1.HttpStatus.CONFLICT,
                    message: [
                        'category cannot be deleted, it has existing child categories!',
                    ],
                    error: 'Conflict',
                });
            }
        }
        await this.categoryRepository.delete(id);
        this.logger.log('category has been deleted!');
        return {
            id: `${id}`,
            message: 'category deleted successfully!',
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(product_variant_entity_1.ProductVariant)),
    __param(3, (0, typeorm_1.InjectRepository)(product_variantPricing_entity_1.ProductVariantPricing)),
    __param(4, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository,
        product_repository_1.ProductRepository,
        product_variant_repository_1.ProductVariantRepository,
        product_variantPricing_repository_1.ProductVariantPricingRepository,
        product_image_repository_1.ProductImageRepository,
        common_1.Logger])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map