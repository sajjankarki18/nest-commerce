import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariantPricing } from './product-variantPricing.entity';

@Entity({ name: 'product_variant' })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  variant_title: string;

  @Column({ nullable: true })
  variant_description: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ nullable: true, default: false })
  in_stock: boolean;

  @Column({ nullable: true })
  product_sku: string;

  @ManyToOne(() => Product, (product) => product.product_variant)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  product_id: string;

  @OneToMany(
    () => ProductVariantPricing,
    (product_variant_pricing) => product_variant_pricing.product_variant,
  )
  product_variant_pricing: ProductVariantPricing[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
