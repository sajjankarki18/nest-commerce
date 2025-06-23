import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CollectionRepository } from "./repositories/collection.repository";
import { CollectionRedirect } from "./entities/collection-redirect.entity";
import { CollectionRedirectRepository } from "./repositories/collection-redirect.repository";
import { Collection } from "./entities/collection.entity";
import { CreateCollectionDto } from "./dto/create-collection.dto";
import { UpdateCollectionDto } from "./dto/update-collection.dto";
import { CreateCollectionRedirectDto } from "./dto/create-collectionRedirect.dto";
import slugify from "slugify";

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: CollectionRepository,
    @InjectRepository(CollectionRedirect)
    private readonly collectionRedirectRepository: CollectionRedirectRepository,
    private readonly logger: Logger,
  ) {}

  async createCollection(collectionDto: CreateCollectionDto) {
    try {
      const collection = this.collectionRepository.create({
        title: collectionDto.title,
        slug: collectionDto.slug,
        image_url: collectionDto.image_url,
        status: collectionDto.status,
      });
      const savedCollection = await this.collectionRepository.save(collection);

      /* create a new slug for each collection while saving it */
      if (savedCollection?.title) {
        const updatedCollectionSlug: string = slugify(savedCollection.title, {
          strict: true,
          lower: true,
        });

        await this.collectionRepository.update(savedCollection.id, {
          slug: updatedCollectionSlug,
        });
      }

      return await this.collectionRepository.findOne({
        where: {
          id: savedCollection.id,
        },
      });
    } catch (error) {
      this.logger.error(
        "some error occurred while creating the banner!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while creating a collection, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async getCollectionById(id: string): Promise<Collection> {
    const collection = await this.collectionRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!collection) {
      this.logger.error("collection not found!");
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`collection with ${id} not found`],
        error: "Not Found",
      });
    }

    this.logger.log("collection fetched successfully!");
    return collection;
  }

  async getAllCollections(): Promise<{ data: Collection[]; total: number }> {
    try {
      const banners = await this.collectionRepository.find();
      const totalBanners = banners.length;

      this.logger.log("banners fetched successfully!");
      return {
        data: banners,
        total: totalBanners,
      };
    } catch (error) {
      this.logger.error(
        "some error occurred while fetching the banners!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while fetching all banners, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async updateCollection(id: string, collectionDto: UpdateCollectionDto) {
    await this.getCollectionById(id);

    try {
      await this.collectionRepository.update(
        { id },
        {
          title: collectionDto.title,
          slug: collectionDto.slug,
          image_url: collectionDto.image_url,
          status: collectionDto.status,
        },
      );

      this.logger.log("collectionhas been updated!");
      return await this.collectionRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        "some error occurred while updating the banner!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while updating a banner, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async deleteCollection(id: string): Promise<{ id: string; message: string }> {
    await this.getCollectionById(id);

    try {
      await this.collectionRepository.delete(id);
      this.logger.log("collectionhas been deleted!");
      return {
        id: `${id}`,
        message: "collection deleted successfully!",
      };
    } catch (error) {
      this.logger.error(
        "some error occurred while deleting the banner!",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while deleting a banner, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  /* redirect services */

  /* validate a new collection-redirect */
  async validateCollectionData(collectionId: string) {
    const collection = await this.collectionRepository.findOne({
      where: {
        id: collectionId,
      },
    });

    if (!collection) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`collection with ${collectionId} not found!`],
        error: "Not Found",
      });
    }
  }

  async createCollectionRedirect(
    collectionRedirectDto: CreateCollectionRedirectDto,
  ) {
    await this.validateCollectionData(collectionRedirectDto.collection_id);
    try {
      const collectionRedirect = this.collectionRedirectRepository.create({
        collection_id: collectionRedirectDto.collection_id,
        redirect_id: collectionRedirectDto.redirect_id,
        redirect_type: collectionRedirectDto.redirect_type,
      });

      this.logger.log("created new collection-redirect");
      return await this.collectionRedirectRepository.save(collectionRedirect);
    } catch (error) {
      this.logger.error(
        "some error occurred while creating a new collection-redirect",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while creating a new collection-redirect, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async getCollectionRedirectById(id: string) {
    const redirect = await this.collectionRedirectRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!redirect) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`redirect with ${id} not found!`],
        error: "Not Found",
      });
    }

    return redirect;
  }

  async updateCollectionRedirect(
    id: string,
    collectionRedirectDto: CreateCollectionRedirectDto,
  ) {
    /* validate the collection-redirect */
    await this.getCollectionRedirectById(id);
    try {
      await this.collectionRedirectRepository.update(
        { id },
        {
          collection_id: collectionRedirectDto.collection_id,
          redirect_id: collectionRedirectDto.redirect_id,
          redirect_type: collectionRedirectDto.redirect_type,
        },
      );

      return await this.collectionRedirectRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        "some error occurred while updating a collection-redirect",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while updating a collection, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }

  async deleteCollectionRedirect(
    id: string,
  ): Promise<{ id: string; message: string }> {
    await this.getCollectionRedirectById(id);
    try {
      await this.collectionRedirectRepository.delete(id);
      return {
        id: `${id}`,
        message: `collection-redirect deleted`,
      };
    } catch (error) {
      this.logger.error(
        "some error occurred while deleting a collection-redirect",
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          "some error occurred while deleting a collection, please try again!",
        ],
        error: "Internal Server Error",
      });
    }
  }
}
