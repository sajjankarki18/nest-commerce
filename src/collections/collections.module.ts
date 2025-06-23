import { Logger, Module } from "@nestjs/common";
import { CollectionsAdminController } from "./collections.admin.controller";
import { CollectionsService } from "./collections.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CollectionRedirect } from "./entities/collection-redirect.entity";
import { Collection } from "./entities/collection.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Collection, CollectionRedirect])],
  controllers: [CollectionsAdminController],
  providers: [CollectionsService, Logger],
})
export class CollectionsModule {}
