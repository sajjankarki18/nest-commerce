import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { BannerRepository } from './repositories/banner.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { RedirectTypeEnum } from 'src/enums/RedirectType.enum';
import { Category } from 'src/categories/entities/category.entity';
import { CategoryRepository } from 'src/categories/repositories/category.repository';
import { Collection } from 'src/collections/entities/collection.entity';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { Product } from 'src/products/entities/product.entity';
import { ProductRepository } from 'src/products/repositories/product.repository';
import { StatusEnumType } from 'src/enums/StatusType.enum';

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

  /* frontend service to fetch all banners with the related redirects */
  async getAllBannersWithRedirects() {
    const banners = await this.bannerRepository.find({
      where: {
        status: StatusEnumType.Published,
        is_active: true,
      },
    });

    const bannerRedirectData: any[] = [];
    for (const banner of banners) {
      let redirects: { title: string; id: string } = { title: '', id: '' };

      /* banner redirects */
      if (RedirectTypeEnum.Category === banner.redirect_type) {
        const category = await this.categoryRepository.findOne({
          where: {
            id: banner.redirect_id,
          },
        });

        redirects = category
          ? { title: category.name, id: category.id }
          : { title: '', id: '' };
      }

      /* category redirects */
      if (RedirectTypeEnum.Product === banner.redirect_type) {
        const product = await this.productRepository.findOne({
          where: {
            id: banner.redirect_id,
          },
        });

        redirects = product
          ? { title: product.title, id: product.id }
          : { title: '', id: '' };
      }

      /* collection redirects */
      if (RedirectTypeEnum.Collection === banner.redirect_type) {
        const collection = await this.collectionRepository.findOne({
          where: {
            id: banner.redirect_id,
          },
        });

        redirects = collection
          ? { title: collection.title, id: collection.id }
          : { title: '', id: '' };
      }

      bannerRedirectData.push({
        ...banner,
        redirects: redirects,
      });
    }

    this.logger.log(`Banners with redirects has been fetched successfully!`);
    return {
      data: bannerRedirectData,
    };
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
        this.logger.warn('category redirect not found!');
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: ['redirect of category not found!'],
          error: 'Not Found Error',
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
        this.logger.warn('product redirect not found');
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: ['redirect of product not found!'],
          error: 'Not Found',
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
        this.logger.warn('collection redirect not found!');
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: ['redirect of collection not found!'],
          error: 'Not Found',
        });
      }
    }
  }

  async createBanner(bannerDto: CreateBannerDto): Promise<Banner> {
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

      this.logger.log('banner created successfully!');
      return await this.bannerRepository.save(banner);
    } catch (error) {
      this.logger.error(
        'some error occurred while creating the banner!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a banner, please try again!',
        ],
        error: 'Internal Server Error',
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
      this.logger.error('banner not found!');
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`banner with ${id} not found`],
        error: 'Not Found',
      });
    }

    this.logger.log('banner fetched successfully!');
    return banner;
  }

  async getAllBanners(): Promise<{ data: Banner[]; total: number }> {
    try {
      const banners = await this.bannerRepository.find();
      const totalBanners = banners.length;

      this.logger.log('banners fetched successfully!');
      return {
        data: banners,
        total: totalBanners,
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while fetching the banners!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while fetching all banners, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async updateBanner(
    id: string,
    bannerDto: UpdateBannerDto,
  ): Promise<Banner | null> {
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

      this.logger.log('banner has been updated!');
      return await this.bannerRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        'some error occurred while updating the banner!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating a banner, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteBanner(id: string): Promise<{ id: string; message: string }> {
    await this.getBannerById(id);

    try {
      await this.bannerRepository.delete(id);
      this.logger.log('banner has been deleted!');
      return {
        id: `${id}`,
        message: 'banner deleted successfully!',
      };
    } catch (error) {
      this.logger.error(
        'some error occurred while deleting the banner!',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting a banner, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }
}
