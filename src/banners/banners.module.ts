import { forwardRef, Logger, Module } from '@nestjs/common';
import { BannerAdminController } from './banners.admin.controller';
import { BannerService } from './banners.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { CollectionsModule } from 'src/collections/collections.module';
import { Collection } from 'src/collections/entities/collection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Banner, Category, Collection]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => CollectionsModule),
  ],
  controllers: [BannerAdminController],
  providers: [BannerService, Logger],
})
export class BannersModule {}
