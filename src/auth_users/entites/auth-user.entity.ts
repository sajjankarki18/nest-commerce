import { StatusEnumType } from 'src/enums/StatusType.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'admin_user' })
export class AdminUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  first_name: string;

  @Column({ nullable: false })
  last_name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  phone_number: number;

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
