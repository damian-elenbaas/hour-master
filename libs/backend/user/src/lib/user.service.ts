import * as bcrypt from 'bcrypt';
import { ICreateUser, IUpdateUser, IUser, Id, UserRole } from '@hour-master/shared/api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>) {
    this.seedData();
  }

  async seedData(): Promise<void> {
    this.logger.log(`seedData()`);

    const users = await this.userModel.find().exec();

    if (users.length > 0) return;

    await this.userModel.create({
      username: 'admin',
      password: await this.generateHashedPassword('admin'),
      firstname: 'Admin',
      lastname: 'Admin',
      email: 'admin@admin.com',
      role: UserRole.ADMIN
    })
  }

  async getAll(): Promise<IUser[]> {
    this.logger.log(`getAll()`);

    return await this.userModel.find().exec();
  }

  async getOne(id: Id): Promise<IUser> {
    this.logger.log(`getOne(${id})`);

    try {
      const user = await this.userModel.findById(id).exec();

      this.logger.log(`user: ${user}`);

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch(e) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findOneByUsername(username: string): Promise<IUser> {
    this.logger.log(`findOneByUsername(${username})`);

    const user = await this.userModel.findOne({ username: username }).exec();

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async create(user: ICreateUser): Promise<IUser> {
    this.logger.log(`create`);

    // Generate hashed password
    const hashedPassword =
      await this.generateHashedPassword(user.password as string);
    user.password = hashedPassword;

    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  async update(id: Id, user: IUpdateUser): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const updatedUser = await this.userModel.findByIdAndUpdate(id, user).exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return true;
  }

  async delete(id: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return true;
  }

  async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
}
