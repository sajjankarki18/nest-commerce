import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceType } from './entities/device-type.entity';
import { BrandRepository } from './repositories/brand.repository';
import { Model } from './entities/model.entity';
import { ModelRepository } from './repositories/model.repository';
import slugify from 'slugify';
import { Brand } from './entities/brand.entity';
import { CreateDeviceTypeDto } from './dto/deviceType-dto/create-deviceType.dto';
import { UpdateDeviceTypeDto } from './dto/deviceType-dto/update-deviceType.dto';
import { CreateBrandDto } from './dto/brand-dto/create-brand.dto';
import { UpdateBrandDto } from './dto/brand-dto/update-brand.dto';
import { CreateModelDto } from './dto/model-dto/create-model.dto';
import { UpdateModelDto } from './dto/model-dto/update-model.dto';
import { DevicetypeRespository } from './repositories/device-type.repository';
import { StatusEnumType } from 'src/enums/StatusType.enum';

@Injectable()
export class DevicetypeService {
  constructor(
    @InjectRepository(DeviceType)
    private readonly deviceTypeRepository: DevicetypeRespository,
    @InjectRepository(Brand)
    private readonly brandRepository: BrandRepository,
    @InjectRepository(Model)
    private readonly modelRepository: ModelRepository,
    private readonly logger: Logger,
  ) {}

  /* frontend services */
  async getAllBrandsWithDevices({
    page,
    limit,
    deviceId,
  }: {
    page: number;
    limit: number;
    deviceId: string;
  }) {
    if (!page || !limit) {
      const brands = await this.brandRepository.find({
        where: { status: StatusEnumType.Published, device_id: deviceId },
      });
      return {
        data: brands,
      };
    }

    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['page and limit should be of positive integers!'],
        error: 'Not Found',
      });
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [brands, totalBrand] = await this.brandRepository.find({
      where: {
        status: StatusEnumType.Published,
        device_id: deviceId,
      },
      skip: (page - 1) * newLimit,
      take: newLimit,
      order: { created_at: 'desc' },
    });

    return {
      data: brands,
      page: page,
      limit: limit,
      total: totalBrand,
    };
  }

  /* fetch all models with accociated brands */
  async getAllModelsWithBrandId({
    page,
    limit,
    brandId,
  }: {
    page: number;
    limit: number;
    brandId: string;
  }) {
    if (!page || !limit) {
      const brands = await this.modelRepository.find({
        where: { status: StatusEnumType.Published, brand_id: brandId },
      });
      return {
        data: brands,
      };
    }

    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: ['page and limit should be of positive integers!'],
        error: 'Not Found',
      });
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [models, totalModels] = await this.modelRepository.find({
      where: {
        status: StatusEnumType.Published,
        brand_id: brandId,
      },
      skip: (page - 1) * newLimit,
      take: newLimit,
      order: { created_at: 'desc' },
    });

    return {
      data: models,
      page: page,
      limit: limit,
      total: totalModels,
    };
  }

  async createDeviceType(
    deviceTypeDto: CreateDeviceTypeDto,
  ): Promise<DeviceType> {
    try {
      const deviceType = this.deviceTypeRepository.create({
        title: deviceTypeDto.title,
        image_url: deviceTypeDto.image_url,
        description: deviceTypeDto.description,
        status: deviceTypeDto.status,
      });
      return await this.deviceTypeRepository.save(deviceType);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new deviceType, please try again later!',
        ],
        error: 'Not Found',
      });
    }
  }

  async getDeviceTypeById(id: string): Promise<DeviceType> {
    const deviceType = await this.deviceTypeRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!deviceType) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`Device-type with ${id} has not found!`],
        error: 'Not Found',
      });
    }

    return deviceType;
  }

  async getAllDeviceTypes({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{
    data: DeviceType[];
    page: number;
    limit: number;
    total: number;
  }> {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      this.logger.warn('page and limit should be of positive integers!');
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['Page and limit should be of positive integers!'],
        error: 'Conflict',
      });
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [deviceTypes, totalDeviceTypes] =
      await this.deviceTypeRepository.findAndCount({
        skip: (page - 1) * newLimit,
        take: newLimit,
        order: { created_at: 'desc' },
      });

    this.logger.log('devices has been fetched successfully!');
    return {
      data: deviceTypes,
      page: page,
      limit: newLimit,
      total: totalDeviceTypes,
    };
  }

  async updateDeviceType(deviceTypeDto: UpdateDeviceTypeDto, id: string) {
    const deviceType =
      await this.getDeviceTypeById(id); /* check if the device_id exists */
    try {
      /* slug-title logic */
      let deviceTitleSlug: string = deviceType?.title;
      if (deviceTypeDto?.title && deviceTitleSlug !== deviceTypeDto.title) {
        deviceTitleSlug = slugify(deviceTypeDto.title, {
          lower: true,
          strict: true,
        });
      }
      /* update the deivce */
      await this.deviceTypeRepository.update(
        { id: id },
        {
          title: deviceTypeDto.title,
          image_url: deviceTypeDto.image_url,
          description: deviceTypeDto.description,
          slug: deviceTitleSlug,
          status: deviceTypeDto.status,
        },
      );

      return await this.deviceTypeRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      this.logger.error('some error occurred, while updating the device-type');
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating the device-type, please try again',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteDeviceType(id: string): Promise<{ id: string; message: string }> {
    await this.getDeviceTypeById(id);
    try {
      await this.deviceTypeRepository.delete(id);
      return {
        id: `${id}`,
        message: 'device-type has been deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        'some error occurred, while deleting the device-type',
        error,
      );
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting the device-type, please try again',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* brand services */
  async checkDeviceExists(deviceId: string): Promise<void> {
    const deviceType = await this.deviceTypeRepository.findOne({
      where: {
        id: deviceId,
      },
    });

    if (!deviceType) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`device_type with ${deviceId} not found`],
        error: 'Not Found',
      });
    }
  }

  async createBrand(
    brandDto: CreateBrandDto,
    deviceId: string,
  ): Promise<Brand> {
    await this.checkDeviceExists(
      deviceId,
    ); /* check device_id exists before creating the brand */
    try {
      const brand = this.brandRepository.create({
        title: brandDto.title,
        device_id: deviceId,
        status: brandDto.status,
      });

      return await this.brandRepository.save(brand);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new brand, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async getBrandById(id: string): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!brand) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`brand with ${id} not found!`],
        error: 'Not Found',
      });
    }

    return brand;
  }

  async getAllBrands({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{ data: Brand[]; page: number; limit: number; total: number }> {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['page and limit should be positive integers!'],
        error: 'Conflict',
      });
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [brands, totalBrands] = await this.brandRepository.findAndCount({
      skip: (page - 1) * newLimit,
      take: newLimit,
      order: { created_at: 'desc' },
    });

    return {
      data: brands,
      page: page,
      limit: limit,
      total: totalBrands,
    };
  }

  async updateBrand(brandDto: UpdateBrandDto, id: string) {
    await this.getBrandById(id);
    await this.checkDeviceExists(brandDto.device_id);
    try {
      await this.brandRepository.update(
        { id: id },
        {
          title: brandDto.title,
          device_id: brandDto.device_id,
          status: brandDto.status,
        },
      );

      return await this.brandRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating a brand, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteBrand(id: string): Promise<{ id: string; message: string }> {
    await this.getBrandById(id);
    try {
      await this.brandRepository.delete(id);
      return {
        id: `${id}`,
        message: 'brand has been deleted successfully!',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting a brand, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  /* model services */
  async checkBrandExists(brandId: string): Promise<void> {
    const brand = await this.brandRepository.findOne({
      where: {
        id: brandId,
      },
    });

    if (!brand) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`brand with ${brandId} not found`],
        error: 'Not Found',
      });
    }
  }

  async createModel(modelDto: CreateModelDto, brandId: string): Promise<Model> {
    await this.checkBrandExists(
      brandId,
    ); /* check device_id exists before creating the brand */
    try {
      const model = this.modelRepository.create({
        title: modelDto.title,
        brand_id: brandId,
        status: modelDto.status,
      });

      return await this.modelRepository.save(model);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while creating a new model, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async getModelById(id: string): Promise<Model> {
    const model = await this.modelRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!model) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: [`model with ${id} not found!`],
        error: 'Not Found',
      });
    }

    return model;
  }

  async getAllModels({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<{ data: Model[]; page: number; limit: number; total: number }> {
    if (isNaN(Number(page)) || isNaN(Number(limit)) || page < 0 || limit < 0) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        message: ['page and limit should be positive integers!'],
        error: 'Conflict',
      });
    }

    const newLimit: number = limit > 10 ? 10 : limit;
    const [models, totalModels] = await this.modelRepository.findAndCount({
      skip: (page - 1) * newLimit,
      take: newLimit,
      order: { created_at: 'desc' },
    });

    return {
      data: models,
      page: page,
      limit: limit,
      total: totalModels,
    };
  }

  async updateModel(modelDto: UpdateModelDto, id: string) {
    await this.getModelById(id);
    await this.checkBrandExists(modelDto.brand_id);
    try {
      await this.modelRepository.update(
        { id: id },
        {
          title: modelDto.title,
          brand_id: modelDto.brand_id,
          status: modelDto.status,
        },
      );

      return await this.modelRepository.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while updating a model, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }

  async deleteModel(id: string): Promise<{ id: string; message: string }> {
    await this.getModelById(id);
    try {
      await this.modelRepository.delete(id);
      return {
        id: `${id}`,
        message: 'model has been deleted successfully!',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: [
          'some error occurred while deleting a model, please try again!',
        ],
        error: 'Internal Server Error',
      });
    }
  }
}
