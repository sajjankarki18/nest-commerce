import { RedirectTypeEnum } from "src/enums/RedirectType.enum";
import { StatusEnumType } from "src/enums/StatusType.enum";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "banner" })
export class Banner {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({
    nullable: true,
    default: StatusEnumType.Draft,
  })
  status: StatusEnumType;

  @Column({ nullable: true, default: false })
  is_active: boolean;

  @Column({
    nullable: true,
    default: RedirectTypeEnum.None,
  })
  redirect_type: RedirectTypeEnum;

  @Column({ nullable: true })
  redirect_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
