import { BannerService } from './banners.service';
export declare class BannerController {
    private readonly bannerService;
    constructor(bannerService: BannerService);
    getAllBannersWithRedirects(): Promise<{
        data: any[];
    }>;
}
