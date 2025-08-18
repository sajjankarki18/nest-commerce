import { Controller, Get, Param, Query } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Collections') // Groups endpoints under "Collections"
@Controller('/collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionsService) {}

  @Get('/all-collections')
  @ApiOperation({ summary: 'Get all collections with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of collections retrieved successfully',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getAllCollections(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.collectionService.getAllCollections({ page, limit });
  }

  @Get('/:slug')
  @ApiOperation({ summary: 'Get collections by slug' })
  @ApiParam({
    name: 'slug',
    type: String,
    description: 'Slug of the collection to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'Collection retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getCollectionsBySlug(@Param('slug') slug: string) {
    return this.collectionService.getCollectionsBySlug(slug);
  }
}
