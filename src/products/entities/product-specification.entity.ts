import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'productSpecification' })
export class productSpecification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  product_id: string;

  @ManyToOne(() => Product, (product) => product.product_specification)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
