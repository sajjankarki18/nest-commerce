import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/all-parent')
  getAllParentCategories() {
    return this.categoriesService.getAllParentCategories();
  }
}
