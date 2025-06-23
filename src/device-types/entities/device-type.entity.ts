import { StatusEnumType } from "src/enums/StatusType.enum";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Brand } from "./brand.entity";

@Entity({ name: "device_type" })
export class DeviceType {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @OneToMany(() => Brand, (brand) => brand.device_type)
  brand: Brand[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
} 