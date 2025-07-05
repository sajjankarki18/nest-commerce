import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartRepository extends Repository<Cart> {
  constructor(dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }
}
