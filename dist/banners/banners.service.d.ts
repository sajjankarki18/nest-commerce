import { Logger } from '@nestjs/common';
import { Banner } from './entities/banner.entity';
import { BannerRepository } from './repositories/banner.repository';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { CategoryRepository } from 'src/categories/repositories/category.repository';
import { CollectionRepository } from 'src/collections/repositories/collection.repository';
import { ProductRepository } from 'src/products/repositories/product.repository';
export declare class BannerService {
    private readonly bannerRepository;
    private readonly categoryRepository;
    private readonly collectionRepository;
    private readonly productRepository;
    private readonly logger;
    constructor(bannerRepository: BannerRepository, categoryRepository: CategoryRepository, collectionRepository: CollectionRepository, productRepository: ProductRepository, logger: Logger);
    getAllBannersWithRedirects(): Promise<{
        data: any[];
    }>;
    validateBannerRedirectTypes(bannerDto: CreateBannerDto): Promise<void>;
    createBanner(bannerDto: CreateBannerDto): Promise<Banner>;
    getBannerById(id: string): Promise<Banner>;
    getAllBanners(): Promise<{
        data: Banner[];
        total: number;
    }>;
    updateBanner(id: string, bannerDto: UpdateBannerDto): Promise<Banner | null>;
    deleteBanner(id: string): Promise<{
        id: string;
        message: string;
    }>;
}
