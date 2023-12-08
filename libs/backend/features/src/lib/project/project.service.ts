import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import {
  ICreateProject,
  IProject,
  IUpdateProject,
  Id,
} from '@hour-master/shared/api';
import { RecommendationsService } from '@hour-master/backend/recommendations';
import { HourSchemeService } from '../hour-scheme/hour-scheme.service';

@Injectable()
export class ProjectService {
  private readonly logger: Logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>,
    private readonly recommendationsService: RecommendationsService,
    @Inject(forwardRef(() => HourSchemeService))
    private readonly hourSchemeService: HourSchemeService
  ) {}

  async getAll(): Promise<IProject[]> {
    this.logger.log(`getAll()`);

    const projects = await this.projectModel
      .find()
      .populate('admin')
      .exec();

    return projects;
  }

  async getOne(id: Id): Promise<IProject> {
    this.logger.log(`getOne(${id})`);

    const project = await this.projectModel.findById(id).exec();

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    await project.populate('admin');

    return project;
  }

  async getMany(ids: Id[]): Promise<IProject[]> {
    this.logger.log(`getMany(${ids})`);

    const projects = await this.projectModel.find({ _id: { $in: ids } }).exec();

    if (!projects) {
      throw new NotFoundException(`Projects with ids ${ids} not found`);
    }

    return projects;
  }

  async create(project: ICreateProject): Promise<IProject> {
    this.logger.log(`create`);

    const createdProject = await this.projectModel.create(project);

    if(!createdProject) {
      throw new Error('Could not create project');
    }

    const n4jResult = this.recommendationsService.createOrUpdateProject(createdProject);

    if(!n4jResult) {
      await this.projectModel.findByIdAndDelete(createdProject._id).exec();
      throw new Error('Could not create project');
    }

    return createdProject;
  }

  async update(id: Id, project: IUpdateProject): Promise<boolean> {
    this.logger.log(`update(${id})`);

    const updatedProject = await this.projectModel
      .findByIdAndUpdate(id, project)
      .exec();

    if (!updatedProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    const n4jResult = this.recommendationsService.createOrUpdateProject(updatedProject);

    if(!n4jResult) {
      throw new Error('Could not update project');
    }

    return true;
  }

  async delete(id: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();

    if (!deletedProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    await this.hourSchemeService.deleteRowsByProjectId(id);

    await this.recommendationsService.deleteProject(id);

    return true;
  }
}
