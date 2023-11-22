import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, Id, UserRole } from '@hour-master/shared/api';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@hour-master/backend/decorators';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('')
  @Roles([UserRole.ADMIN])
  async getAll(): Promise<IUser[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  @Roles([UserRole.ADMIN])
  async getOne(@Param('id') id: Id): Promise<IUser> {
    return await this.userService.getOne(id);
  }

  @Post('')
  @Roles([UserRole.ADMIN])
  async create(@Body() body: CreateUserDto): Promise<IUser> {
    return await this.userService.create(body);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN])
  async update(@Param('id') id: Id, @Body() body: UpdateUserDto): Promise<boolean> {
    return await this.userService.update(id, body);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN])
  async delete(@Param('id') id: Id): Promise<boolean> {
    return await this.userService.delete(id);
  }

}
