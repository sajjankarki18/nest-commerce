import { AuthProviderTypes } from 'src/enums/auth-providerType.enum';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'customer' })
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @Column({ nullable: true })
  auth_provider_type: AuthProviderTypes;

  @Column({ nullable: true })
  auth_provider_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
