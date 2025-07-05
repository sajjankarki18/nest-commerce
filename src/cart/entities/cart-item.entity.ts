import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from './cart.entity';

@Entity({ name: 'cart_item' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  product_id: string;

  @Column({ nullable: true })
  variant_id: string;

  @Column({ nullable: true })
  product_title: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ type: 'numeric', nullable: true })
  price: number;

  @Column({ nullable: true })
  cart_id: string;

  @ManyToOne(() => Cart, (cart) => cart.cart_item)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
