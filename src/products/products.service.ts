import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/dtos';
import { UpdateProductDto } from './dto/dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  // Create a product
  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  // Get all products
  async findAll(): Promise<Product[]> {
    return this.productModel.find().populate('category').populate('subcategory').exec();
  }

  // Get product by ID
  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).populate('category').populate('subcategory').exec();
  }

  // Update a product
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  // Delete a product
  async remove(id: string): Promise<Product> {
    return this.productModel.findByIdAndDelete(id).exec();
  }
}
