import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductQuestion } from '../entities/product-question.entity';

@Injectable()
export class ProductQuestionRepository extends Repository<ProductQuestion> {
  constructor(dataSource: DataSource) {
    super(ProductQuestion, dataSource.createEntityManager());
  }
}
