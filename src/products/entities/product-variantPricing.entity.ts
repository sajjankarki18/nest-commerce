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

  @Column({ type: 'numeric', nullable: true })
  price: number;

  @Column({ type: 'numeric', nullable: true })
  selling_price: number;

  @Column({ type: 'numeric', nullable: true })
  crossed_price: number;
}
