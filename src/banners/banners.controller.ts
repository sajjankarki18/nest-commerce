import { Controller, Get } from "@nestjs/common";
import { BannerService } from "./banners.service";

@Controller("/banners")
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  /* get banners data with their associated redirects */
  @Get("/redirects")
  getbannersDataWithRedirects() {
    return this.bannerService.getbannersDataWithRedirects();
  }
}
