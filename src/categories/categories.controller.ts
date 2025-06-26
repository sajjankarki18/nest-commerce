import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all-parent')
  getAllParentCategories() {
    return this.categoriesService.getAllParentCategories();
  }

  @Get('/all-categories')
  getAllCategoriesForStore() {
    return this.categoriesService.getAllCategoriesForStore();
  }

  @Get('/:slug')
  getAllCategoryProductsBySlug(@Param('slug') slug: string) {
    return this.categoriesService.getAllCategoryProductsBySlug(slug);
  }
}
