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
import { CollectionsService } from './collections.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CreateCollectionRedirectDto } from './dto/create-collectionRedirect.dto';
import { UpdateCollectionRedirectDto } from './dto/update-collectionRedirectDto';

@ApiTags('Collections Admin')
@Controller('/admin/collections')
export class CollectionsAdminController {
  constructor(private readonly collectionsService: CollectionsService) {}

  /* create a new collection  */
  @Post()
  @ApiCreatedResponse({
    description: 'collection  created successfully',
    type: Collection,
  })
  @ApiBadRequestResponse({ description: 'Invalid input!' })
  createCollection(@Body() collectionDto: CreateCollectionDto) {
    return this.collectionsService.createCollection(collectionDto);
  }

  /* get a collection  by id */
  @Get('/:id')
  @ApiParam({ name: 'id', description: 'UUID of the banner' })
  @ApiOkResponse({
    description: 'collection  fetched successfully!',
    type: Collection,
  })
  @ApiNotFoundResponse({ description: 'collection  not found!' })
  getCollectionById(@Param('id') id: string) {
    return this.collectionsService.getCollectionById(id);
  }

  /* fetch all banners */
  @Get()
  @ApiOkResponse({
    description: 'All banners fetched successfully!',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Banner' } },
        total: { type: 'number' },
      },
    },
  })
  getAllCollections(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.collectionsService.getAllCollections({ page, limit });
  }

  /* update a collection  */
  @Put('/:id')
  @ApiParam({ name: 'id', description: 'UUID of the banner' })
  @ApiOkResponse({
    description: 'collection  updated successfully!',
    type: Collection,
  })
  @ApiBadRequestResponse({ description: 'Invalid input' })
  @ApiNotFoundResponse({ description: 'collection  not found!' })
  updateCollection(
    @Param('id') id: string,
    @Body() collectionDto: UpdateCollectionDto,
  ) {
    return this.collectionsService.updateCollection(id, collectionDto);
  }

  /* delete a collection  */
  @Delete('/:id')
  @ApiParam({ name: 'id', description: 'UUID of the banner' })
  @ApiOkResponse({ description: 'collection  deleted successfully!' })
  @ApiNotFoundResponse({ description: 'collection  not found!' })
  deleteCollection(@Param('id') id: string) {
    return this.collectionsService.deleteCollection(id);
  }

  /* collection-redirect routes */
  @Post('/collection-redirect')
  createCollectionRedirect(
    @Body() collectionRedirectDto: CreateCollectionRedirectDto,
  ) {
    return this.collectionsService.createCollectionRedirect(
      collectionRedirectDto,
    );
  }

  @Get('/collection-redirect/:id')
  getCollectionRedirectById(@Param('id') id: string) {
    return this.collectionsService.getCollectionRedirectById(id);
  }

  @Put('/collection-redirect/:id')
  updateCollectionRedirect(
    @Param('id') id: string,
    @Body() collectionRedirectDto: UpdateCollectionRedirectDto,
  ) {
    return this.collectionsService.updateCollectionRedirect(
      id,
      collectionRedirectDto,
    );
  }

  @Delete('/collection-redirect/:id')
  deleteCollectionRedirect(@Param('id') id: string) {
    return this.collectionsService.deleteCollectionRedirect(id);
  }
}
