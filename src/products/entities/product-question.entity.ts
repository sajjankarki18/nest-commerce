import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_question' })
export class ProductQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.product_question)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: true })
  product_id: string;

  @Column({ nullable: true })
  question: string;

  @Column({ nullable: true })
  customer_id: string;

  @Column({ nullable: true })
  answer: string;

  @Column({ nullable: true })
  admin_user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
