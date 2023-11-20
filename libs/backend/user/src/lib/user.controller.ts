import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, Id } from '@hour-master/shared/api';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('')
  async getAll(): Promise<IUser[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: Id): Promise<IUser> {
    return await this.userService.getOne(id);
  }

  @Post('')
  async create(@Body() body: CreateUserDto): Promise<IUser> {
    return await this.userService.create(body);
  }

  @Patch(':id')
  async update(@Param('id') id: Id, @Body() body: UpdateUserDto): Promise<boolean> {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: Id): Promise<boolean> {
    return await this.userService.delete(id);
  }

}
