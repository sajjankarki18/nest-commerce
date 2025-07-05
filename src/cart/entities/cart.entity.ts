import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CartStatusEnum } from 'src/enums/cart-status.enum';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  customer_id: string;

  @Column({ nullable: true })
  discount_amount: number;

  @Column({ nullable: true })
  shipping_price: number;

  @Column({ type: 'numeric', nullable: true })
  total_price: number;

  @OneToMany(() => CartItem, (cart_item) => cart_item.cart)
  cart_item: CartItem[];

  @Column({ nullable: true })
  cart_status: CartStatusEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
