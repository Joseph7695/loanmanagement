import { Injectable } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  searchUser(
    username: string,
    isStillWorking: boolean | null,
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ): [User[], number] | PromiseLike<[User[], number]> {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;

    console.log('searchUser(): ', username, itemsPerPage, pageNumber);

    if (isStillWorking == null) {
      return this.userRepository.findAndCount({
        where: {
          name: Like(`%${username}%`),
          ...(userRole != UserRole.SUPERADMIN && { id: userId }),
        },
        order: { id: 'DESC' },
        take: itemsPerPage,
        skip: skip,
      });
    } else {
      return this.userRepository.findAndCount({
        where: {
          name: Like(`%${username}%`),
          isStillWorking: isStillWorking,
          ...(userRole != UserRole.SUPERADMIN && { id: userId }),
        },
        order: { id: 'DESC' },
        take: itemsPerPage,
        skip: skip,
      });
    }
  }
  saltOrRounds = 10;
  async login(username: string, password: string) {
    const superadmin = await this.userRepository.findOneBy({
      role: UserRole.SUPERADMIN,
    });

    if (!superadmin) {
      console.log('inserting superadmin');
      await this.userRepository.insert({
        username: 'SUPERADMIN',
        role: UserRole.SUPERADMIN,
        password: await bcrypt.hash('SUPERADMIN', this.saltOrRounds),
        name: 'SUPERADMIN',
        isStillWorking: true,
      });
    }
    const user = await this.userRepository.findOne({
      select: {
        password: true,
        id: true,
        role: true,
        username: true,
        name: true,
      },
      where: {
        username: username,
      },
    });
    const comparresult = await bcrypt.compare(password, user?.password);
    if (comparresult) {
      return user;
    } else {
      return null;
    }
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async findOne(id: number, userRole: UserRole, userId: number) {
    if (userRole != UserRole.SUPERADMIN) {
      return await this.userRepository.findOneBy({ id: userId });
    }
    return await this.userRepository.findOneBy({ id: id });
  }
  async deleteUser(userId: number) {
    return await this.userRepository.softDelete(userId);
  }
  async editUser(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, this.saltOrRounds);
    }
    return await this.userRepository.save(user);
  }
  async addUser(user: User) {
    user.password = await bcrypt.hash(user.password, this.saltOrRounds);
    return await this.userRepository.insert(user);
  }
  async getUserList(
    itemsPerPage: number,
    pageNumber: number,
    userRole: UserRole,
    userId: number,
  ) {
    itemsPerPage = itemsPerPage || 10;
    const skip = pageNumber * itemsPerPage || 0;
    return await this.userRepository.findAndCount({
      // order: { name: 'DESC' },
      where: { ...(userRole != UserRole.SUPERADMIN && { id: userId }) },
      order: { id: 'DESC' },
      take: itemsPerPage,
      skip: skip,
      // relations: ['customer'],
    });
  }
  // async findOne(username: string): Promise<User | undefined> {
  //   return this.users.find((user) => user.username === username);
  // }
}
