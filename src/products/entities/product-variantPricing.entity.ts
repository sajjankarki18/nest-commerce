import { CurrencyTypeEnum } from 'src/enums/CurrencyType.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'product_variant_pricing' })
export class ProductVariantPricing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, default: CurrencyTypeEnum.NPR })
  currency_type: CurrencyTypeEnum;

  @Column({ nullable: true })
  variant_id: string;

  @ManyToOne(
    () => ProductVariant,
    (product_variant) => product_variant.product_variant_pricing,
  )
  @JoinColumn({ name: 'variant_id' })
  product_variant: ProductVariant;

  @Column('numeric', { nullable: true, precision: 10, scale: 2 })
  price: number;

  @Column('numeric', { nullable: true, precision: 10, scale: 2 })
  selling_price: number;

  @Column('numeric', { nullable: true, precision: 10, scale: 2 })
  crossed_price: number;
}
