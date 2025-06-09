import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CollectionRedirectTypeEnum } from '../types/collection-redirectType.enum';

@Entity({ name: 'collection_redirect' })
export class CollectionRedirect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  collection_id: string;

  @Column({ nullable: true })
  redirect_type: CollectionRedirectTypeEnum;

  @Column({ nullable: true })
  redirect_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
