import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_item' })
export class OrderItem {
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
  selling_price: number;

  @Column({ type: 'numeric', nullable: true })
  crossed_price: number;

  @Column({ name: 'order_id' })
  order_id: string;

  @ManyToOne(() => Order, (order) => order.order_item)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}
