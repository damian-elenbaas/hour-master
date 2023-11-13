import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, Id } from '@hour-master/shared/api';
import { CreateUserDto, UpdateUserDto } from '@hour-master/backend/dto';

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

}
