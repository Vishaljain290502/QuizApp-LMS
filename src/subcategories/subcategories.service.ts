import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subcategory, SubcategoryDocument } from './subcategory.schema';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectModel(Subcategory.name) private subcategoryModel: Model<SubcategoryDocument>,
  ) {}

  // Create a new subcategory
  async create(createSubcategoryDto: CreateSubcategoryDto): Promise<Subcategory> {
    const createdSubcategory = new this.subcategoryModel(createSubcategoryDto);
    return createdSubcategory.save();
  }

  // Get all subcategories
  async findAll(): Promise<Subcategory[]> {
    return this.subcategoryModel.find().populate('category').exec();
  }

  // Get subcategory by ID
  async findOne(id: string): Promise<Subcategory> {
    return this.subcategoryModel.findById(id).populate('category').exec();
  }

  // Update a subcategory by ID
  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto): Promise<Subcategory> {
    return this.subcategoryModel.findByIdAndUpdate(id, updateSubcategoryDto, { new: true }).exec();
  }

  // Delete a subcategory by ID
  async remove(id: string): Promise<Subcategory> {
    return this.subcategoryModel.findByIdAndDelete(id).exec();
  }
}
