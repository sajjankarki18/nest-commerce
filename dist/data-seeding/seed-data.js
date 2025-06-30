"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedData = void 0;
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const category_entity_1 = require("../categories/entities/category.entity");
const category_seed_1 = require("./static/category.seed");
const StatusType_enum_1 = require("../enums/StatusType.enum");
const banner_entity_1 = require("../banners/entities/banner.entity");
const RedirectType_enum_1 = require("../enums/RedirectType.enum");
const collection_entity_1 = require("../collections/entities/collection.entity");
const slugify_1 = require("slugify");
const collection_redirect_entity_1 = require("../collections/entities/collection-redirect.entity");
const collection_redirectType_enum_1 = require("../collections/types/collection-redirectType.enum");
const product_entity_1 = require("../products/entities/product.entity");
const product_variant_entity_1 = require("../products/entities/product-variant.entity");
const product_variantPricing_entity_1 = require("../products/entities/product-variantPricing.entity");
const product_description_entity_1 = require("../products/entities/product-description.entity");
const product_image_entity_1 = require("../products/entities/product-image.entity");
const CurrencyType_enum_1 = require("../enums/CurrencyType.enum");
const VariantDetails_enum_1 = require("../enums/VariantDetails.enum");
const seedData = async (dataSource) => {
    await seedBannersData(dataSource);
    await seedCategoriesData(dataSource);
    await seedProductsData(dataSource);
    await seedCollectionsData(dataSource);
    await seedDeviceTypesData(dataSource);
};
exports.seedData = seedData;
const seedBannersData = async (dataSource) => {
    if (process.env.SEED_DATA === 'true') {
        return;
    }
    await seedCategoriesData(dataSource);
    await seedProductsData(dataSource);
    await seedCollectionsData(dataSource);
    const bannersRepository = dataSource.getRepository(banner_entity_1.Banner);
    const categoriesRepository = dataSource.getRepository(category_entity_1.Category);
    const productsRepository = dataSource.getRepository(product_entity_1.Product);
    const collectionRepository = dataSource.getRepository(collection_entity_1.Collection);
    const categories = await categoriesRepository.find();
    const products = await productsRepository.find();
    const collections = await collectionRepository.find();
    const seedBanners = () => {
        const randomCategoryData = faker_1.faker.helpers.arrayElement(categories);
        const randomProductsData = faker_1.faker.helpers.arrayElement(products);
        const randomCollectionData = faker_1.faker.helpers.arrayElement(collections);
        const categoriesData = bannersRepository.create({
            title: faker_1.faker.lorem.word(),
            image_url: faker_1.faker.image.url(),
            status: faker_1.faker.helpers.arrayElement([
                StatusType_enum_1.StatusEnumType.Published,
                StatusType_enum_1.StatusEnumType.Draft,
            ]),
            is_active: faker_1.faker.datatype.boolean(),
            redirect_type: RedirectType_enum_1.RedirectTypeEnum.Category,
            redirect_id: randomCategoryData.id,
        });
        const productsData = bannersRepository.create({
            title: faker_1.faker.lorem.word(),
            image_url: faker_1.faker.image.url(),
            status: faker_1.faker.helpers.arrayElement([
                StatusType_enum_1.StatusEnumType.Published,
                StatusType_enum_1.StatusEnumType.Draft,
            ]),
            is_active: faker_1.faker.datatype.boolean(),
            redirect_type: RedirectType_enum_1.RedirectTypeEnum.Product,
            redirect_id: randomProductsData.id,
        });
        const collectionData = bannersRepository.create({
            title: faker_1.faker.lorem.word(),
            image_url: faker_1.faker.image.url(),
            status: faker_1.faker.helpers.arrayElement([
                StatusType_enum_1.StatusEnumType.Published,
                StatusType_enum_1.StatusEnumType.Draft,
            ]),
            is_active: faker_1.faker.datatype.boolean(),
            redirect_type: RedirectType_enum_1.RedirectTypeEnum.Collection,
            redirect_id: randomCollectionData.id,
        });
        return [categoriesData, productsData, collectionData];
    };
    let bannersSeededData = [];
    bannersSeededData = [
        ...bannersSeededData,
        ...(await Promise.all(Array.from({ length: 15 }, () => seedBanners()))).flat(),
    ];
    return await bannersRepository.save(bannersSeededData);
};
const seedCategoriesData = async (dataSource) => {
    if (process.env.SEED_DATA === 'true') {
        return;
    }
    const categoryRepository = dataSource.getRepository(category_entity_1.Category);
    const reversedData = [...category_seed_1.categoryData].reverse();
    for (const categoryDataItem of reversedData) {
        let deviceCategory = await categoryRepository.findOneBy({
            name: categoryDataItem.name,
            parent_id: undefined,
        });
        if (!deviceCategory) {
            deviceCategory = await categoryRepository.save({
                name: categoryDataItem.name,
                slug: faker_1.faker.helpers.slugify(categoryDataItem.name).toLowerCase(),
                description: faker_1.faker.lorem.sentence(),
                status: StatusType_enum_1.StatusEnumType.Published,
                icon_url: faker_1.faker.image.url(),
            });
        }
        for (const skinTypeData of categoryDataItem.skinTypes) {
            let skinTypeCategory = await categoryRepository.findOneBy({
                name: skinTypeData.name,
                parent_id: deviceCategory.id,
            });
            if (!skinTypeCategory) {
                skinTypeCategory = await categoryRepository.save({
                    name: skinTypeData.name,
                    slug: faker_1.faker.helpers.slugify(skinTypeData.name).toLowerCase(),
                    description: faker_1.faker.lorem.sentence(),
                    parent_id: deviceCategory.id,
                    status: StatusType_enum_1.StatusEnumType.Published,
                });
            }
            for (const subcategoryData of skinTypeData.subcategories) {
                const subCategory = await categoryRepository.findOneBy({
                    name: subcategoryData.name,
                    parent_id: skinTypeCategory.id,
                });
                if (!subCategory) {
                    await categoryRepository.save({
                        name: subcategoryData.name,
                        slug: faker_1.faker.helpers.slugify(subcategoryData.name).toLowerCase(),
                        description: faker_1.faker.lorem.sentence(),
                        parent_id: skinTypeCategory.id,
                        status: StatusType_enum_1.StatusEnumType.Published,
                    });
                }
            }
        }
    }
};
const seedProductsData = async (dataSource) => {
    if (process.env.SEED_DATA === 'true') {
        return;
    }
    const productRepository = dataSource.getRepository(product_entity_1.Product);
    const productVariantRepository = dataSource.getRepository(product_variant_entity_1.ProductVariant);
    const productVariantPricingRepository = dataSource.getRepository(product_variantPricing_entity_1.ProductVariantPricing);
    const productDescriptionRepository = dataSource.getRepository(product_description_entity_1.ProductDescription);
    const productImageRepository = dataSource.getRepository(product_image_entity_1.ProductImage);
    const categoryRepository = dataSource.getRepository(category_entity_1.Category);
    const firstLevelCategories = await categoryRepository.find({
        where: {
            parent_id: (0, typeorm_1.IsNull)(),
        },
    });
    const secondLevelCategories = await categoryRepository.find({
        where: {
            parent_id: (0, typeorm_1.In)(firstLevelCategories.map((firstLevelCat) => firstLevelCat.id)),
        },
    });
    const thirdLevelCategories = await categoryRepository.find({
        where: {
            parent_id: (0, typeorm_1.In)(secondLevelCategories.map((secondLevelCat) => secondLevelCat.id)),
        },
    });
    for (const category of thirdLevelCategories) {
        const title = faker_1.faker.lorem.words();
        const slug = (0, slugify_1.default)(title, {
            strict: true,
            lower: true,
        });
        const products = productRepository.create({
            title: title,
            short_description: faker_1.faker.lorem.sentence(),
            slug: slug,
            status: faker_1.faker.helpers.arrayElement([
                StatusType_enum_1.StatusEnumType.Published,
                StatusType_enum_1.StatusEnumType.Draft,
            ]),
            category_id: category.id,
        });
        await productRepository.save(products);
    }
    const products = await productRepository.find();
    for (const product of products) {
        const exists = await productDescriptionRepository.findOneBy({
            product_id: product.id,
        });
        if (!exists) {
            const description = productDescriptionRepository.create({
                product_id: product.id,
                description: faker_1.faker.lorem.paragraphs(2),
            });
            await productDescriptionRepository.save(description);
        }
    }
    for (const product of products) {
        const numberOfProductImages = faker_1.faker.number.int({ min: 2, max: 4 });
        for (let index = 0; index < numberOfProductImages; index++) {
            const productImage = productImageRepository.create({
                image_url: faker_1.faker.image.url(),
                product_id: product.id,
                is_primary: faker_1.faker.datatype.boolean(),
            });
            await productImageRepository.save(productImage);
        }
    }
    const sizeValues = Object.values(VariantDetails_enum_1.SizeEnum);
    const colorValues = Object.values(VariantDetails_enum_1.ColorEnum);
    for (const product of products) {
        const numberOfVariants = faker_1.faker.number.int({ min: 2, max: 3 });
        const shuffledSizes = faker_1.faker.helpers.shuffle(sizeValues);
        const shuffledColors = faker_1.faker.helpers.shuffle(colorValues);
        for (let index = 0; index < numberOfVariants; index++) {
            const size = shuffledSizes[index];
            const color = shuffledColors[index];
            const productVariant = productVariantRepository.create({
                variant_title: `${size} / ${color}`,
                size: size,
                color: color,
                quantity: faker_1.faker.number.int({ min: 1, max: 50 }),
                in_stock: true,
                product_sku: faker_1.faker.lorem.slug(),
                product_id: product.id,
            });
            await productVariantRepository.save(productVariant);
        }
    }
    const productVariants = await productVariantRepository.find();
    for (const variant of productVariants) {
        const numberOfPricing = faker_1.faker.number.int({ min: 1, max: 3 });
        for (let index = 0; index < numberOfPricing; index++) {
            const variantPricing = productVariantPricingRepository.create({
                currency_type: faker_1.faker.helpers.arrayElement([
                    CurrencyType_enum_1.CurrencyTypeEnum.INR,
                    CurrencyType_enum_1.CurrencyTypeEnum.NPR,
                    CurrencyType_enum_1.CurrencyTypeEnum.USD,
                ]),
                variant_id: variant.id,
                price: Number(faker_1.faker.finance.amount({ min: 1000, max: 10000 })),
                selling_price: Number(faker_1.faker.finance.amount({ min: 1000, max: 10000 })),
                crossed_price: Number(faker_1.faker.finance.amount({ min: 1000, max: 10000 })),
            });
            await productVariantPricingRepository.save(variantPricing);
        }
    }
};
const seedCollectionsData = async (datasource) => {
    if (process.env.SEED_DATA === 'true') {
        return;
    }
    await seedCategoriesData(datasource);
    const productsRepository = datasource.getRepository(product_entity_1.Product);
    const collectionsRepository = datasource.getRepository(collection_entity_1.Collection);
    const categoriesRepository = datasource.getRepository(category_entity_1.Category);
    const collectionRedirectRepository = datasource.getRepository(collection_redirect_entity_1.CollectionRedirect);
    const categories = await categoriesRepository.find();
    const products = await productsRepository.find();
    const seedCollection = () => {
        const title = faker_1.faker.lorem.words();
        const slug = (0, slugify_1.default)(title, {
            strict: true,
            lower: true,
        });
        const collection = collectionsRepository.create({
            title: title,
            slug: slug,
            image_url: faker_1.faker.image.url(),
            status: faker_1.faker.helpers.arrayElement([
                StatusType_enum_1.StatusEnumType.Published,
                StatusType_enum_1.StatusEnumType.Draft,
            ]),
        });
        return collection;
    };
    let seedCollectionsData = [];
    seedCollectionsData = [
        ...seedCollectionsData,
        ...(await Promise.all(Array.from({ length: 10 }, () => seedCollection()))).flat(),
    ];
    const savedCollections = await collectionsRepository.save(seedCollectionsData);
    const redirectsData = [];
    for (const collection of savedCollections) {
        const randomCategoryData = faker_1.faker.helpers.arrayElement(categories);
        const randomProductsData = faker_1.faker.helpers.arrayElement(products);
        redirectsData.push(collectionRedirectRepository.create({
            collection_id: collection.id,
            redirect_type: collection_redirectType_enum_1.CollectionRedirectTypeEnum.Category,
            redirect_id: randomCategoryData.id,
        }), collectionRedirectRepository.create({
            collection_id: collection.id,
            redirect_type: collection_redirectType_enum_1.CollectionRedirectTypeEnum.Product,
            redirect_id: randomProductsData.id,
        }));
    }
    return await collectionRedirectRepository.save(redirectsData);
};
const seedDeviceTypesData = async (dataSource) => { };
//# sourceMappingURL=seed-data.js.map