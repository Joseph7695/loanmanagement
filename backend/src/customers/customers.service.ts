import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Equal, Like, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { UserRole } from '../users/user.entity';

@Injectable()
export class CustomersService {
  searchCustomer(
    name: string,
    blackListMode: string,
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ): [Customer[], number] | PromiseLike<[Customer[], number]> {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;

    console.log('searchCUstomer(): ', name, blackListMode, itemsPerPage, skip);
    switch (blackListMode) {
      case '2':
        console.log('case 2');
        // if (userRole != UserRole.SUPERADMIN) {
        //   return this.customersRepository.findAndCount({
        //     where: [
        //       {
        //         isBlacklist: true,
        //         name: Like(`%${name}%`),
        //         user: { id: userId },
        //       },
        //       {
        //         isBlacklist: true,
        //         ic: Like(`%${name}%`),
        //         user: { id: userId },
        //       },
        //     ],
        //     order: { id: 'DESC' },
        //     take: itemsPerPage,
        //     skip: skip,
        //     relations: ['user'],
        //   });
        // }
        return this.customersRepository.findAndCount({
          where: [
            { isBlacklist: true, name: Like(`%${name}%`) },
            { isBlacklist: true, ic: Like(`%${name}%`) },
          ],
          order: { id: 'DESC' },
          take: itemsPerPage,
          skip: skip,
          relations: ['user'],
        });
      case '3':
        console.log('case 3');
        // if (userRole != UserRole.SUPERADMIN) {
        //   return this.customersRepository.findAndCount({
        //     where: [
        //       {
        //         isBlacklist: false,
        //         name: Like(`%${name}%`),
        //         user: { id: userId },
        //       },
        //       {
        //         isBlacklist: false,
        //         ic: Like(`%${name}%`),
        //         user: { id: userId },
        //       },
        //     ],
        //     order: { id: 'DESC' },
        //     take: itemsPerPage,
        //     skip: skip,
        //     relations: ['user'],
        //   });
        // }
        return this.customersRepository.findAndCount({
          where: [
            { isBlacklist: false, name: Like(`%${name}%`) },
            { isBlacklist: false, ic: Like(`%${name}%`) },
          ],
          order: { id: 'DESC' },
          take: itemsPerPage,
          skip: skip,
          relations: ['user'],
        });
      case '1':
      default:
        console.log('case default');
        // if (userRole != UserRole.SUPERADMIN) {
        //   return this.customersRepository.findAndCount({
        //     where: [
        //       { name: Like(`%${name}%`), user: { id: userId } },
        //       { ic: Like(`%${name}%`), user: { id: userId } },
        //     ],
        //     order: { id: 'DESC' },
        //     take: itemsPerPage,
        //     skip: skip,
        //     relations: ['user'],
        //   });
        // }
        return this.customersRepository.findAndCount({
          where: [{ name: Like(`%${name}%`) }, { ic: Like(`%${name}%`) }],
          order: { id: 'DESC' },
          take: itemsPerPage,
          skip: skip,
          relations: ['user'],
        });
    }
  }
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  findAll(
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ): Promise<[Customer[], number]> {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;
    // if (userRole != UserRole.SUPERADMIN) {
    //   return this.customersRepository.findAndCount({
    //     where: { user: { id: userId } },
    //     order: { id: 'DESC' },
    //     take: itemsPerPage,
    //     skip: skip,
    //   });
    // }
    return this.customersRepository.findAndCount({
      order: { id: 'DESC' },
      take: itemsPerPage,
      skip: skip,
    });
  }
  findAllBlacklist(
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ): Promise<[Customer[], number]> {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;
    // if (userRole != UserRole.SUPERADMIN) {
    //   return this.customersRepository.findAndCount({
    //     where: { isBlacklist: Equal(true), user: { id: userId } },
    //     order: { id: 'DESC' },
    //     skip: skip,
    //     take: itemsPerPage,
    //   });
    // }
    return this.customersRepository.findAndCount({
      where: { isBlacklist: Equal(true) },
      order: { id: 'DESC' },
      skip: skip,
      take: itemsPerPage,
    });
  }
  findAllNoBlacklist(
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ): Promise<[Customer[], number]> {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;
    // if (userRole != UserRole.SUPERADMIN) {
    //   return this.customersRepository.findAndCount({
    //     where: { isBlacklist: Equal(true), user: { id: userId } },
    //     order: { id: 'DESC' },
    //     skip: skip,
    //     take: itemsPerPage,
    //   });
    // }
    return this.customersRepository.findAndCount({
      where: { isBlacklist: Equal(true) },
      order: { id: 'DESC' },
      skip: skip,
      take: itemsPerPage,
    });
  }
  findOne(
    id: number,
    userRole: UserRole,
    userId: number,
  ): Promise<Customer | null> {
    // if (userRole != UserRole.SUPERADMIN) {
    //   return this.customersRepository.findOne({
    //     where: { id, user: { id: userId } },
    //     relations: ['loans', 'loans.repayments', 'user'],
    //   });
    // }
    return this.customersRepository.findOne({
      where: { id },
      relations: ['loans', 'loans.repayments', 'user'],
    });
  }
  async softdelete(id: number): Promise<DeleteResult> {
    return await this.customersRepository.softDelete(id);
  }

  async addOne(customer: Customer): Promise<Customer> {
    return await this.customersRepository.save(customer);
  }
  async updateOne(customer: Customer): Promise<Customer> {
    console.log(customer);
    return await this.customersRepository.save(customer);
  }
}
