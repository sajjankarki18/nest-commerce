import { DataSource, In, IsNull } from "typeorm";
import { faker } from "@faker-js/faker";
import { Category } from "src/categories/entities/category.entity";
import { categoryData } from "./static/category.seed";
import { StatusEnumType } from "src/enums/StatusType.enum";
import { Banner } from "src/banners/entities/banner.entity";
import { RedirectTypeEnum } from "src/enums/RedirectType.enum";
import { Collection } from "src/collections/entities/collection.entity";
import slugify from "slugify";
import { CollectionRedirect } from "src/collections/entities/collection-redirect.entity";
import { CollectionRedirectTypeEnum } from "src/collections/types/collection-redirectType.enum";
import { Product } from "src/products/entities/product.entity";
import { ProductVariant } from "src/products/entities/product-variant.entity";
import { ProductVariantPricing } from "src/products/entities/product-variantPricing.entity";
import { ProductDescription } from "src/products/entities/product-description.entity";
import { ProductImage } from "src/products/entities/product-image.entity";
import { CurrencyTypeEnum } from "src/enums/CurrencyType.enum";

export const seedData = async (dataSource: DataSource): Promise<void> => {
  await seedBannersData(dataSource);
  await seedCategoriesData(dataSource);
  await seedProductsData(dataSource);
  await seedCollectionsData(dataSource);
};

/* seed banners */
const seedBannersData = async (dataSource: DataSource) => {
  if (process.env.SEED_DATA === "true") {
    return;
  }

  await seedCategoriesData(dataSource);
  await seedProductsData(dataSource);
  await seedCollectionsData(dataSource);

  const bannersRepository = dataSource.getRepository(Banner);
  const categoriesRepository = dataSource.getRepository(Category);
  const productsRepository = dataSource.getRepository(Product);
  const collectionsRepository = dataSource.getRepository(Collection);

  const categories = await categoriesRepository.find();
  const products = await productsRepository.find();
  const collections = await collectionsRepository.find();

  const seedBanners = (): Banner[] => {
    const randomCategoryData = faker.helpers.arrayElement(categories);
    const randomProductData = faker.helpers.arrayElement(products);
    const randomCollectionsData = faker.helpers.arrayElement(collections);

    /* categories-redirects */
    const categoriesData = bannersRepository.create({
      title: faker.lorem.word(),
      image_url: faker.image.url(),
      status: faker.helpers.arrayElement([
        StatusEnumType.Published,
        StatusEnumType.Draft,
      ]),
      is_active: faker.datatype.boolean(),
      redirect_type: RedirectTypeEnum.Category,
      redirect_id: randomCategoryData.id,
    });

    /* products-redirects */
    const productsData = bannersRepository.create({
      title: faker.lorem.word(),
      image_url: faker.image.url(),
      status: faker.helpers.arrayElement([
        StatusEnumType.Published,
        StatusEnumType.Draft,
      ]),
      is_active: faker.datatype.boolean(),
      redirect_type: RedirectTypeEnum.Product,
      redirect_id: randomProductData.id,
    });

    /* collection-redirects */
    const collectionData = bannersRepository.create({
      title: faker.lorem.word(),
      image_url: faker.image.url(),
      status: faker.helpers.arrayElement([
        StatusEnumType.Published,
        StatusEnumType.Draft,
      ]),
      is_active: faker.datatype.boolean(),
      redirect_type: RedirectTypeEnum.Collection,
      redirect_id: randomCollectionsData.id,
    });

    return [categoriesData, productsData, collectionData];
  };

  let bannersSeededData: Banner[] = [];
  bannersSeededData = [
    ...bannersSeededData,
    ...(
      await Promise.all(Array.from({ length: 8 }, () => seedBanners()))
    ).flat(),
  ];

  return await bannersRepository.save(bannersSeededData);
};

/* seed categories */
const seedCategoriesData = async (dataSource: DataSource) => {
  if (process.env.SEED_DATA === "true") {
    return;
  }

  const categoryRepository = dataSource.getRepository(Category);

  const reversedData = [...categoryData].reverse();
  for (const categoryDataItem of reversedData) {
    // Insert Device Type: First Level
    let deviceCategory = await categoryRepository.findOneBy({
      name: categoryDataItem.name,
      parent_id: undefined,
    });

    if (!deviceCategory) {
      deviceCategory = await categoryRepository.save({
        name: categoryDataItem.name,
        slug: faker.helpers.slugify(categoryDataItem.name).toLowerCase(),
        status: StatusEnumType.Published,
        icon_url: faker.image.url(),
      });
    }

    for (const skinTypeData of categoryDataItem.skinTypes) {
      // Insert Skin Type: Second Level
      let skinTypeCategory = await categoryRepository.findOneBy({
        name: skinTypeData.name,
        parent_id: deviceCategory.id,
      });

      if (!skinTypeCategory) {
        skinTypeCategory = await categoryRepository.save({
          name: skinTypeData.name,
          slug: faker.helpers.slugify(skinTypeData.name).toLowerCase(),
          parent_id: deviceCategory.id,
          status: StatusEnumType.Published,
        });
      }

      for (const subcategoryData of skinTypeData.subcategories) {
        // Insert Specific Skin Type: Third Level
        const subCategory = await categoryRepository.findOneBy({
          name: subcategoryData.name,
          parent_id: skinTypeCategory.id,
        });

        if (!subCategory) {
          await categoryRepository.save({
            name: subcategoryData.name,
            slug: faker.helpers.slugify(subcategoryData.name).toLowerCase(),
            parent_id: skinTypeCategory.id,
            status: StatusEnumType.Published,
          });
        }
      }
    }
  }
};

/* seed products data */
const seedProductsData = async (dataSource: DataSource) => {
  if (process.env.SEED_DATA === "true") {
    return;
  }

  const productRepository = dataSource.getRepository(Product);
  const productVariantRepository = dataSource.getRepository(ProductVariant);
  const productVariantPricingRepository = dataSource.getRepository(
    ProductVariantPricing,
  );
  const productDescriptionRepository =
    dataSource.getRepository(ProductDescription);
  const productImageRepository = dataSource.getRepository(ProductImage);

  /* while seeding products, we need to associate each products with the thirlLevelCategories */
  const categoryRepository = dataSource.getRepository(Category);
  const firstLevelCategories = await categoryRepository.find({
    where: {
      parent_id: IsNull(),
    },
  });

  const secondLevelCategories = await categoryRepository.find({
    where: {
      parent_id: In(
        firstLevelCategories.map((firstLevelCat) => firstLevelCat.id),
      ),
    },
  });

  const thirdLevelCategories = await categoryRepository.find({
    where: {
      parent_id: In(
        secondLevelCategories.map((secondLevelCat) => secondLevelCat.id),
      ),
    },
  });

  /* products */
  for (const category of thirdLevelCategories) {
    const title: string = faker.lorem.words();
    const slug: string = slugify(title, {
      strict: true,
      lower: true,
    });
    const products = productRepository.create({
      title: title,
      slug: slug,
      status: faker.helpers.arrayElement([
        StatusEnumType.Published,
        StatusEnumType.Draft,
      ]),
      category_id: category.id,
    });
    await productRepository.save(products);
  }

  /* product-description */
  const products = await productRepository.find();
  for (const product of products) {
    const exists = await productDescriptionRepository.findOneBy({
      product_id: product.id,
    });

    if (!exists) {
      const description = productDescriptionRepository.create({
        product_id: product.id,
        description: faker.lorem.paragraphs(2),
      });

      await productDescriptionRepository.save(description);
    }
  }

  /* product-images */
  for (const product of products) {
    const numberOfProductImages: number = faker.number.int({ min: 2, max: 4 });
    for (let index = 0; index < numberOfProductImages; index++) {
      const productImage = productImageRepository.create({
        image_url: faker.image.url(),
        product_id: product.id,
      });

      await productImageRepository.save(productImage);
    }
  }
  /* product-images */
  /* product-variants */
  for (const product of products) {
    const numberOfVariants: number = faker.number.int({ min: 2, max: 3 });

    for (let index = 0; index < numberOfVariants; index++) {
      const productVariant = productVariantRepository.create({
        variant_title: faker.lorem.word(),
        variant_description: faker.lorem.words(),
        quantity: faker.number.int({ min: 1, max: 50 }),
        in_stock: faker.datatype.boolean(),
        product_sku: faker.lorem.slug(),
        product_id: product.id,
      });

      await productVariantRepository.save(productVariant);
    }
  }

  /* variants-pricing */
  const productVariants = await productVariantRepository.find();
  for (const variant of productVariants) {
    const numberOfPricing: number = faker.number.int({ min: 1, max: 3 });

    for (let index = 0; index < numberOfPricing; index++) {
      const variantPricing = productVariantPricingRepository.create({
        currency_type: faker.helpers.arrayElement([
          CurrencyTypeEnum.INR,
          CurrencyTypeEnum.NPR,
          CurrencyTypeEnum.USD,
        ]),
        variant_id: variant.id,
        price: Number(faker.finance.amount({ min: 1000, max: 10000 })),
        selling_price: Number(faker.finance.amount({ min: 1000, max: 10000 })),
        crossed_price: Number(faker.finance.amount({ min: 1000, max: 10000 })),
      });

      await productVariantPricingRepository.save(variantPricing);
    }
  }
};

/* seed collections data */
const seedCollectionsData = async (datasource: DataSource) => {
  if (process.env.SEED_DATA === "true") {
    return;
  }

  await seedCategoriesData(datasource);
  await seedProductsData(datasource);

  const collectionsRepository = datasource.getRepository(Collection);
  const categoriesRepository = datasource.getRepository(Category);
  const productsRepository = datasource.getRepository(Product);
  const collectionRedirectRepository =
    datasource.getRepository(CollectionRedirect);

  const categories = await categoriesRepository.find();
  const products = await productsRepository.find();

  const seedCollection = (): Collection => {
    const title = faker.lorem.words();
    const slug = slugify(title, {
      strict: true,
      lower: true,
    });
    const collection = collectionsRepository.create({
      title: title,
      slug: slug,
      image_url: faker.image.url(),
      status: faker.helpers.arrayElement([
        StatusEnumType.Published,
        StatusEnumType.Draft,
      ]),
    });

    return collection;
  };

  let seedCollectionsData: Collection[] = [];
  seedCollectionsData = [
    ...seedCollectionsData,
    ...(
      await Promise.all(Array.from({ length: 10 }, () => seedCollection()))
    ).flat(),
  ];

  const savedCollections =
    await collectionsRepository.save(seedCollectionsData);
  const redirectsData: CollectionRedirect[] = [];

  /* loop through each collections and create a new collection-redirects */
  for (const collection of savedCollections) {
    const randomCategoryData = faker.helpers.arrayElement(categories);
    const randomProductsData = faker.helpers.arrayElement(products);

    redirectsData.push(
      collectionRedirectRepository.create({
        collection_id: collection.id,
        redirect_type: CollectionRedirectTypeEnum.Category,
        redirect_id: randomCategoryData.id,
      }),
      collectionRedirectRepository.create({
        collection_id: collection.id,
        redirect_type: CollectionRedirectTypeEnum.Product,
        redirect_id: randomProductsData.id,
      }),
    );
  }
  return await collectionRedirectRepository.save(redirectsData);
};
