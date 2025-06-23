import { StatusEnumType } from "src/enums/StatusType.enum";
import { Product } from "src/products/entities/product.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "category" })
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  parent_id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @OneToMany(() => Product, (product) => product.category)
  product: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
