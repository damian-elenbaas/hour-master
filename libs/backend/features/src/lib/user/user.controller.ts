import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException
} from '@nestjs/common';
import { UserService } from './user.service';
import { IJWTPayload, IUser, Id, UserRole } from '@hour-master/shared/api';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '@hour-master/backend/decorators';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async getAll(): Promise<IUser[]> {
    return await this.userService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: Id): Promise<IUser> {
    return await this.userService.getOne(id);
  }

  @Post('')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async create(
    @Body() body: CreateUserDto,
    @Request() req: any
  ): Promise<IUser | null> {
    const user = req.user as IJWTPayload;
    return await this.userService.create(body, user.sub);
  }

  @Patch(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async update(
    @Param('id') id: Id,
    @Body() body: UpdateUserDto,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    return await this.userService.update(id, body, user.sub);
  }

  @Delete(':id')
  @Roles([UserRole.ADMIN, UserRole.OFFICE])
  async delete(
    @Param('id') id: Id,
    @Request() req: any
  ): Promise<boolean> {
    const user = req.user as IJWTPayload;
    if (user.sub === id) {
      throw new UnauthorizedException('You cannot delete yourself');
    }
    return await this.userService.delete(id);
  }
}
