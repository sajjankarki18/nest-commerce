import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatusEnum } from 'src/enums/order-status.enum';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  customer_id: string;

  @Column({ type: 'int', unique: true })
  @Generated('increment')
  order_number: number;

  @Column({ nullable: true })
  cart_id: string;

  @Column({ nullable: true })
  order_status: OrderStatusEnum;

  @Column({ nullable: true })
  payment_status: string;

  @Column({ nullable: true })
  payment_method: string;

  @Column({ nullable: true })
  shipping_price: number;

  @Column({ type: 'numeric', nullable: true })
  sub_total: number;

  @Column({ type: 'numeric', nullable: true })
  total_price: number;

  @ManyToOne(() => OrderItem, (order_item) => order_item.order)
  order_item: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
