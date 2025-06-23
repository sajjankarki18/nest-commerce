import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CollectionRedirectTypeEnum } from "../types/collection-redirectType.enum";
import { Collection } from "./collection.entity";

@Entity({ name: "collection_redirect" })
export class CollectionRedirect {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  collection_id: string;

  @Column({ nullable: true })
  redirect_type: CollectionRedirectTypeEnum;

  @ManyToOne(() => Collection, (collection) => collection.collection_redirect)
  @JoinColumn({ name: "collection_id" })
  collection: Collection;

  @Column({ nullable: true })
  redirect_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
