import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { CategoriesAdminController } from "./categories.admin.controller";
import { CategoriesService } from "./categories.service";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesAdminController],
  providers: [CategoriesService, Logger],
})
export class CategoriesModule {}
