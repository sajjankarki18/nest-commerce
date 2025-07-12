import { Controller, Get, Param, Query } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('/collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionsService) {}

  @Get('/all-collections')
  getAllCollections(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.collectionService.getAllCollections({ page, limit });
  }

  @Get('/:slug')
  getCollectionsBySlug(@Param('slug') slug: string) {
    return this.collectionService.getCollectionsBySlug(slug);
  }
}
