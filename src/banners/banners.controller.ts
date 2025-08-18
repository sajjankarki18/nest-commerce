import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banners.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Banners') // Groups endpoints in Swagger UI
@Controller('/banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get('/redirects')
  @ApiOperation({ summary: 'Get all banners with their redirect URLs' })
  @ApiResponse({
    status: 200,
    description: 'List of banners with redirects successfully retrieved',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getAllBannersWithRedirects() {
    return this.bannerService.getAllBannersWithRedirects();
  }
}
