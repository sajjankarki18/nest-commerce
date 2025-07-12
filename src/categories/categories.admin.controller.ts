import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { StatusEnumType } from 'src/enums/StatusType.enum';

@ApiTags('Category Admin')
@Controller('/admin/categories')
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /* create a new category */
  @Post()
  @ApiCreatedResponse({
    description: 'Category created successfully',
    type: Category,
  })
  @ApiBadRequestResponse({ description: 'Invalid input!' })
  createCategory(@Body() categoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(categoryDto);
  }

  /* fetch all categories */
  @Get()
  @ApiOkResponse({
    description: 'All Categories fetched successfully!',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/category' },
        },
        total: { type: 'number' },
      },
    },
  })
  getAllCategories(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: StatusEnumType,
  ) {
    return this.categoriesService.getAllCategories({ page, limit, status });
  }

  /* get category by id */
  @Get('/:id')
  @ApiParam({ name: 'id', description: 'UUID of the category' })
  @ApiOkResponse({
    description: 'category fetched successfully!',
    type: Category,
  })
  @ApiNotFoundResponse({ description: 'category not found!' })
  getCategoryById(@Param('id') id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  /* update categories */
  @Put('/:id')
  @ApiParam({ name: 'id', description: 'UUID of the category' })
  @ApiOkResponse({
    description: 'category updated successfully!',
    type: Category,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'category not found!' })
  updateCategory(
    @Param('id') id: string,
    @Body() categoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, categoryDto);
  }

  /* delete a category */
  @Delete('/:id')
  @ApiParam({ name: 'id', description: 'UUID of the category' })
  @ApiOkResponse({ description: 'category deleted successfully!' })
  @ApiNotFoundResponse({ description: 'category not found!' })
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
