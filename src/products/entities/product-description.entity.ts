import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_description' })
export class ProductDescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  product_id: string;

  @OneToOne(() => Product, (product) => product.product_description)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
