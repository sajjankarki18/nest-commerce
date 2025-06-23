import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BannerRepository } from "./repositories/banner.repository";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import { RedirectTypeEnum } from "src/enums/RedirectType.enum";
import { Category } from "src/categories/entities/category.entity";
import { CategoryRepository } from "src/categories/repositories/category.repository";
import { Collection } from "src/collections/entities/collection.entity";
import { CollectionRepository } from "src/collections/repositories/collection.repository";
import { Product } from "src/products/entities/product.entity";
import { ProductRepository } from "src/products/repositories/product.repository";
import { Banner } from "./entities/banner.entity";
import { StatusEnumType } from "src/enums/StatusType.enum";

const banner_count: number = 15;
@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: BannerRepository,
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(Collection)
    private readonly collectionRepository: CollectionRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository,
    private readonly logger: Logger,
  ) {}

  /* front-end services */
  async getbannersDataWithRedirects(): Promise<{ data: Banner[] }> {
    /* fetch only those banners that are published and is_active = true */
    const banners = await this.bannerRepository.find({
      where: {
        status: StatusEnumType.Published,
        is_active: true,
      },
    });

    /* query each redirects with the redirect_id based on the redirect_type */
    const bannersRedirectsData: any[] = await Promise.all(
      banners.map(async (banner) => {
        let redirects: any = null;

        /* category redirects */
        if (banner.redirect_type === RedirectTypeEnum.Category) {
          const category = await this.categoryRepository.findOne({
            where: {
              id: banner.redirect_id,
            },
          });

          redirects = category
            ? { name: category?.name, id: category?.id }
            : { name: null, id: null };
        }

        /* product redirects */
        if (banner.redirect_type === RedirectTypeEnum.Product) {
          const product = await this.productRepository.findOne({
            where: {
              id: banner.redirect_id,
            },
          });

          redirects = product
            ? { name: product?.title, id: product?.id }
            : { name: null, id: null };
        }

        /* collection redirects */
        if (banner.redirect_type === RedirectTypeEnum.Collection) {
          const collection = await this.collectionRepository.findOne({
            where: {
              id: banner.redirect_id,
            },
          });

          redirects = collection
            ? { name: collection?.title, id: collection.id }
            : { name: null, id: null };
        }

        return {
          ...banner,
          redirects: redirects,
        };
      }),
    );

    return { data: bannersRedirectsData };
  }

  /* validate the redirectTypes before updating or creating it */
  async validateBannerRedirectTypes(bannerDto: CreateBannerDto): Promise<void> {
    /* category redirects */
    if (bannerDto.redirect_type === RedirectTypeEnum.Category) {
      const category = await this.categoryRepository.findOne({
        where: {
          id: bannerDto.redirect_id,
        },
      });

      if (!category) {
        this.logger.warn("category redirect not found!");
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: ["redirect of category not found!"],
          error: "Not Found Error",
        });
      }
    }

    /* product redirects */
    if (bannerDto.redirect_type === RedirectTypeEnum.Product) {
      const product = await this.productRepository.findOne({
        where: {
          id: bannerDto.redirect_id,
        },
      });

      if (!product) {
        this.logger.warn("product redirect not found");
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: ["redirect of product not found!"],
          error: "Not Found",
        });
      }
    }

    /* collection redirects */
    if (bannerDto.redirect_type === RedirectTypeEnum.Collection) {
      const collection = await this.collectionRepository.findOne({
        where: {
          id: bannerDto.redirect_id,
        },
      });

      if (!collection) {
        this.logger.warn("collection redirect not found!");
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: ["redirect of collection not found!"],
          error: "Not Found",
        });
      }
    }
  }

  /* only allow to create */
  async bannerLimit(): Promise<void> {
    const bannerCount = await this.bannerRepository.count();
    if (bannerCount > banner_count) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ["banner limit exeeded!"],
        error: "Not Found",
      });
    }
  }

  async createBanner(bannerDto: CreateBannerDto): Promise<Banner> {
    await this.bannerLimit(); /* dont allow to add banners more than 10 */
    await this.validateBannerRedirectTypes(bannerDto);
    try {
      const banner = this.bannerRepository.create({
        title: bannerDto.title,
        image_url: bannerDto.image_url,
        status: bannerDto.status,
        is_active: bannerDto.is_active,
        redirect_type: bannerDto.redirect_type,
        redirect_id: bannerDto.redirect_id,
      });

      this.logger.log("banner created successfully!");
      return await this.bannerRepository.save(banner);
    } catch (error) {
      this.logger.error(
        "some error occurred while creating the banner!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while creating a banner, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async getBannerById(id: string): Promise<Banner> {
    const banner = await this.bannerRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!banner) {
      this.logger.error("banner not found!");
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`banner with ${id} not found`],
        error: "Not Found",
      });
    }

    this.logger.log("banner fetched successfully!");
    return banner;
  }

  async getAllBanners(): Promise<{ data: Banner[]; total: number }> {
    try {
      const banners = await this.bannerRepository.find();
      const totalBanners = banners.length;

      this.logger.log("banners fetched successfully!");
      return {
        data: banners,
        total: totalBanners,
      };
    } catch (error) {
      this.logger.error(
        "some error occurred while fetching the banners!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while fetching all banners, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async updateBanner(id: string, bannerDto: UpdateBannerDto) {
    await this.validateBannerRedirectTypes(bannerDto);
    await this.getBannerById(id);
    try {
      await this.bannerRepository.update(
        { id },
        {
          title: bannerDto.title,
          image_url: bannerDto.image_url,
          status: bannerDto.status,
          is_active: bannerDto.is_active,
          redirect_type: bannerDto.redirect_type,
          redirect_id: bannerDto.redirect_id,
        },
      );

      this.logger.log("banner has been updated!");
      return await this.bannerRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        "some error occurred while updating the banner!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while updating a banner, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async deleteBanner(id: string) {
    await this.getBannerById(id);

    try {
      await this.bannerRepository.delete(id);
      this.logger.log("banner has been deleted!");
      return {
        id: `${id}`,
        message: "banner deleted successfully!",
      };
    } catch (error) {
      this.logger.error(
        "some error occurred while deleting the banner!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while deleting a banner, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }
}
