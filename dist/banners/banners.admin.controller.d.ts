import { BannerService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entities/banner.entity';
export declare class BannerAdminController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
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
