import { Body, Request, Controller, Get, Post, Query } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('')
  async getUserList(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('pageNumber') pageNumber: number,
  ) {
    return await this.userService.getUserList(
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Get('/detail')
  async getUser(@Request() req, @Query('id') id: number): Promise<User> {
    // pagination
    return await this.userService.findOne(
      id,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
  @Post('add')
  async addUser(@Request() req, @Body() user: User): Promise<any> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    await this.userService.addUser(user);
    return user;
  }

  @Post('edit')
  async editUser(@Request() req, @Body() user: User): Promise<User> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    return await this.userService.editUser(user);
  }

  @Post('delete')
  async deleteUser(
    @Request() req,
    @Query('userId') userId: number,
  ): Promise<number> {
    if (UserRole[req['user'].role] != UserRole.SUPERADMIN) {
      return;
    }
    return (await this.userService.deleteUser(userId)).affected;
  }

  @Get('/searchUser')
  async searchUser(
    @Request() req,
    @Query('itemsPerPage') itemsPerPage: number,
    @Query('isStillWorking') isStillWorking: boolean | null,
    @Query('pageNumber') pageNumber: number,
    @Query('searchTerm') searchTerm: string,
  ): Promise<[User[], number]> {
    // add new User
    return await this.userService.searchUser(
      searchTerm,
      isStillWorking,
      itemsPerPage,
      pageNumber,
      UserRole[req['user'].role],
      req['user'].sub,
    );
  }
}
