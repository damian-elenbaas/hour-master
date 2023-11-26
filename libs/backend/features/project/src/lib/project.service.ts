import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from "./schemas/project.schema";
import { ICreateProject, IProject, IUpdateProject, Id } from "@hour-master/shared/api";


@Injectable()
export class ProjectService {
  private readonly logger: Logger = new Logger(ProjectService.name);

  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<Project>
  ) {}

  async getAll(): Promise<IProject[]> {
    this.logger.log(`getAll()`);

    const hourSchemes = await this.projectModel.find().exec();

    for (const hourScheme of hourSchemes) {
      await hourScheme.populate('worker');
    }

    return hourSchemes;
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

  async create(project: ICreateProject): Promise<IProject> {
    this.logger.log(`create`);
    const createdProject = await this.projectModel.create(project);
    this.logger.log(`createdProject: ${createdProject}`);
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

    return true;
  }

  async delete(id: Id): Promise<boolean> {
    this.logger.log(`delete(${id})`);

    const deletedProject = await this.projectModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedProject) {
      throw new NotFoundException(`Hour scheme with id ${id} not found`);
    }

    return true;
  }
}

