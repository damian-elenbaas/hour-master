import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, Id } from '@hour-master/shared/api';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('')
  getAll(): IUser[] {
    return this.userService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id: Id): IUser {
    return this.userService.getOne(id);
  }

  @Post('')
  create(@Body() body: CreateUserDto): IUser {
    return this.userService.create(body);
  }

  @(Patch(':id'))
  update(@Param('id') id: Id, @Body() body: UpdateUserDto): boolean {
    return this.userService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: Id): boolean {
    return this.userService.delete(id);
  }

}
