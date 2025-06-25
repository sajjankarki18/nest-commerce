import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_image' })
export class ProductImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  is_primary: boolean;

  @ManyToOne(() => Product, (product) => product.product_image)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  product_id: string;
}
