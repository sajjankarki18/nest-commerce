import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Brand } from "./brand.entity";
import { StatusEnumType } from "src/enums/StatusType.enum";

@Entity({ name: "model" })
export class Model {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  brand_id: string;

  @ManyToMany(() => Brand, (brand) => brand.model)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
