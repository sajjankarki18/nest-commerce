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
  order_status: string;

  @Column({ nullable: true })
  payment_status: string;

  @Column({ nullable: true })
  payment_method: string;

  @ManyToOne(() => OrderItem, (order_item) => order_item.order)
  order_item: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
