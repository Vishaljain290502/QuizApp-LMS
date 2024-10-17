// src/modules/modules.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Module, ModuleDocument } from './module.schema';

@Injectable()
export class ModulesService {
  constructor(@InjectModel('Module') private moduleModel: Model<ModuleDocument>) {}

  async create(createModuleDto: CreateModuleDto): Promise<Module> {
    const newModule = new this.moduleModel(createModuleDto);
    return newModule.save();
  }

  async findAll(): Promise<Module[]> {
    return this.moduleModel.find().populate('course').exec();
  }

  async findOne(id: string): Promise<Module> {
    const module = await this.moduleModel.findById(id).populate('course').exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    return module;
  }

  async update(id: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
    const updatedModule = await this.moduleModel.findByIdAndUpdate(id, updateModuleDto, { new: true }).exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
    return updatedModule;
  }

  async remove(id: string): Promise<void> {
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Module with ID ${id} not found`);
    }
  }
}
