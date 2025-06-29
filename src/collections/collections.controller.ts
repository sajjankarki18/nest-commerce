import { Controller, Get, Param } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('/collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionsService) {}

  @Get('/:slug')
  getCollectionsBySlug(@Param('slug') slug: string) {
    return this.collectionService.getCollectionsBySlug(slug);
  }
}
