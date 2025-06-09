import { Category } from 'src/categories/entities/category.entity';
import { StatusEnumType } from 'src/enums/StatusType.enum';
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
import { ProductVariant } from './product-variant.entity';
import { ProductDescription } from './product-description.entity';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @OneToMany(() => ProductVariant, (product_variant) => product_variant.product)
  product_variant: ProductVariant[];

  @OneToMany(
    () => ProductDescription,
    (product_description) => product_description.product,
  )
  product_description: ProductDescription[];

  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ nullable: true })
  category_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
