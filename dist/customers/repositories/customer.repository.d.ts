import { DataSource, Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
export declare class CustomerRepository extends Repository<Customer> {
    constructor(dataSource: DataSource);
}
