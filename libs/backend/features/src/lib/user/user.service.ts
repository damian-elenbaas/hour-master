import * as bcrypt from 'bcrypt';
import { ICreateUser, IUpdateUser, IUser, Id, UserRole } from '@hour-master/shared/api';
import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';

import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ProjectService } from '../project/project.service';
import { RecommendationsService } from '@hour-master/backend/recommendations';
import { transaction } from '@hour-master/backend/helpers';
import { Connection } from 'mongoose';
import { HourSchemeService } from '../hour-scheme/hour-scheme.service';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectConnection() private connection: Connection,
    private readonly recommendationsService: RecommendationsService,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
    @Inject(forwardRef(() => HourSchemeService))
    private readonly hourSchemeService: HourSchemeService,
  ) { }

  async getAll(): Promise<IUser[]> {
    this.logger.log(`getAll()`);

    return await this.userModel
      .find({ role: { $ne: 'Admin' } })
      .sort({
        firstname: 1,
        lastname: 1,
      })
      .exec();
  }

  async getOne(id: Id): Promise<IUser> {
    this.logger.log(`getOne(${id})`);

    try {
      const user = await this.userModel.findById(id).exec();

      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return user;
    } catch (e) {
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

  async create(user: ICreateUser, userId: Id): Promise<IUser | null> {
    this.logger.log(`creating user`);

    const loggedInUser = await this.getOne(userId);

    if (user.role === UserRole.ADMIN &&
      loggedInUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can create admins');
    }

    const hashedPassword = await this.generateHashedPassword(
      user.password as string
    );
    user.password = hashedPassword;

    const newUser = new this.userModel(user);
    const createdUser = await newUser.save();

    const n4jResult = await this.recommendationsService.createOrUpdateUser(createdUser);

    if (!n4jResult) {
      await this.userModel.findByIdAndDelete(createdUser._id).exec();
      return null;
    }

    return createdUser;
  }

  async update(id: Id, user: IUpdateUser, userId: Id): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const loggedInUser = await this.getOne(userId);

    if (user.role === UserRole.ADMIN &&
      loggedInUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can update admins');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, user)
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const n4jResult = await this.recommendationsService.createOrUpdateUser(updatedUser);

    if (!n4jResult) {
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

    if (deletedUser.role === UserRole.OFFICE) {
      await this.projectService.deleteAllByUserId(id);
    } else if (deletedUser.role === UserRole.ROADWORKER) {
      await this.hourSchemeService.deleteAllByUserId(id);
    }

    const n4jResult = await this.recommendationsService.deleteUser(id);

    if (!n4jResult) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return true;
  }

  async doesUserExist(id: Id): Promise<boolean> {
    this.logger.log(`doesUserExist(${id})`);

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      return false;
    }

    return true;
  }

  async generateHashedPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async validatePassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash);
  }
}
