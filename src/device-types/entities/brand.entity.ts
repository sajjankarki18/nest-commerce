import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DeviceType } from './device-type.entity';
import { StatusEnumType } from 'src/enums/StatusType.enum';
import { Model } from './model.entity';

@Entity({ name: 'brand' })
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  device_id: string;

  @ManyToOne(() => DeviceType, (device_type) => device_type.brand)
  @JoinColumn({ name: 'device_id' })
  device_type: DeviceType;

  @OneToMany(() => Model, (model) => model.brand)
  model: Model[];

  @Column({ nullable: true, default: StatusEnumType.Draft })
  status: StatusEnumType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
