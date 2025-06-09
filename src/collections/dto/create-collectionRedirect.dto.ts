import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CollectionRedirectTypeEnum } from '../types/collection-redirectType.enum';

export class CreateCollectionRedirectDto {
  @IsOptional()
  @IsString()
  collection_id: string;

  @IsOptional()
  @IsEnum(CollectionRedirectTypeEnum)
  redirect_type: CollectionRedirectTypeEnum;

  @IsOptional()
  @IsString()
  redirect_id: string;
}
