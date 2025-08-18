import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Categories') // Group all category endpoints in Swagger
@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all-parent')
  @ApiOperation({ summary: 'Get all parent categories' })
  @ApiResponse({
    status: 200,
    description: 'List of all parent categories retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getAllParentCategories() {
    return this.categoriesService.getAllParentCategories();
  }

  @Get('/all-categories')
  @ApiOperation({ summary: 'Get all categories for store' })
  @ApiResponse({
    status: 200,
    description: 'List of all categories for the store retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getAllCategoriesForStore() {
    return this.categoriesService.getAllCategoriesForStore();
  }

  @Get('/:slug')
  @ApiOperation({ summary: 'Get all products under a category by slug' })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'Slug of the category to fetch products for',
  })
  @ApiResponse({
    status: 200,
    description: 'Products under the given category retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getAllCategoryProductsByCategorySlug(@Param('slug') slug: string) {
    return this.categoriesService.getAllCategoryProductsByCategorySlug(slug);
  }
}
