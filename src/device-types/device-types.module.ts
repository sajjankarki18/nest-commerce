import { Logger, Module } from '@nestjs/common';
import { DeviceTypeController } from './device-types.controller';
import { DevicetypeAdminController } from './device-types.admin.controller';
import { DevicetypeService } from './device-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceType } from './entities/device-type.entity';
import { Brand } from './entities/brand.entity';
import { Model } from './entities/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceType, Brand, Model])],
  controllers: [DeviceTypeController, DevicetypeAdminController],
  providers: [DevicetypeService, Logger],
})
export class DeviceTypesModule {}
