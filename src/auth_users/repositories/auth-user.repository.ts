import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdminUser } from '../entites/auth-user.entity';

@Injectable()
export class AuthUserRepository extends Repository<AdminUser> {
  constructor(dataSource: DataSource) {
    super(AdminUser, dataSource.createEntityManager());
  }
}
