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
import { CollectionRedirect } from "./collection-redirect.entity";

@Entity()
export class Collection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @OneToMany(
    () => CollectionRedirect,
    (collection_redirect) => collection_redirect.collection,
  )
  collection_redirect: CollectionRedirect[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
