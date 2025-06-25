import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banners.service';

@Controller('/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('/redirects')
  getAllBannersWithRedirects() {
    return this.bannerService.getAllBannersWithRedirects();
  }
}
