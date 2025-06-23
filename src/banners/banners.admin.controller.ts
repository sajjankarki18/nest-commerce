import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { BannerService } from "./banners.service";
import { CreateBannerDto } from "./dto/create-banner.dto";
import { UpdateBannerDto } from "./dto/update-banner.dto";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Banner } from "./entities/banner.entity";

@ApiTags("Admin banners")
@Controller("/admin/banners")
export class BannerAdminController {
  constructor(private readonly bannerService: BannerService) {}

  /* create a new banner */
  @Post()
  @ApiCreatedResponse({
    description: "Banner created successfully",
    type: Banner,
  })
  @ApiBadRequestResponse({ description: "Invalid input!" })
  createBanner(@Body() bannerDto: CreateBannerDto) {
    return this.bannerService.createBanner(bannerDto);
  }

  /* get a banner by id */
  @Get("/:id")
  @ApiParam({ name: "id", description: "UUID of the banner" })
  @ApiOkResponse({
    description: "Banner fetched successfully!",
    type: Banner,
  })
  @ApiNotFoundResponse({ description: "Banner not found!" })
  getBannerById(@Param("id") id: string) {
    return this.bannerService.getBannerById(id);
  }

  /* fetch all banners */
  @Get()
  @ApiOkResponse({
    description: "All banners fetched successfully!",
    schema: {
      type: "object",
      properties: {
        data: { type: "array", items: { $ref: "#/components/schemas/Banner" } },
        total: { type: "number" },
      },
    },
  })
  getAllBanners() {
    return this.bannerService.getAllBanners();
  }

  /* update a banner */
  @Put("/:id")
  @ApiParam({ name: "id", description: "UUID of the banner" })
  @ApiOkResponse({
    description: "Banner updated successfully!",
    type: Banner,
  })
  @ApiBadRequestResponse({ description: "Invalid input" })
  @ApiNotFoundResponse({ description: "Banner not found!" })
  updateBanner(@Param("id") id: string, @Body() bannerDto: UpdateBannerDto) {
    return this.bannerService.updateBanner(id, bannerDto);
  }

  /* delete a banner */
  @Delete("/:id")
  @ApiParam({ name: "id", description: "UUID of the banner" })
  @ApiOkResponse({ description: "Banner deleted successfully!" })
  @ApiNotFoundResponse({ description: "Banner not found!" })
  deleteBanner(@Param("id") id: string) {
    return this.bannerService.deleteBanner(id);
  }
}
