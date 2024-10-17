import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schema';
import { Model, Types } from 'mongoose';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {

    constructor(
        @InjectModel('Blog') private readonly blogModel: Model<BlogDocument>
    ){}

    async create(createBlogDto:CreateBlogDto): Promise<Blog> {
        const newBlog = new this.blogModel(createBlogDto);
        return newBlog.save();
    }

    async findAll(): Promise<Blog[]>{
        return this.blogModel.find().exec();
    }
    
    async findOne(id : Types.ObjectId): Promise<Blog> {
        const blog = await this.blogModel.findById(id).exec();
        if(!blog){
            throw new NotFoundException(`Blog with Id ${id} not Found`)
        }
        return blog;
    }

    async update(id:Types.ObjectId, updateBlogDto:UpdateBlogDto): Promise<Blog> {
        const updatedBlog = await this.blogModel.findByIdAndUpdate(id,updateBlogDto, {new:true}).exec();
        if(!updatedBlog){
            throw new NotFoundException(`Blog with this Id ${id} not Found`);
        }
        return updatedBlog;
    }

    async remove(id: Types.ObjectId): Promise<void>{
       const result = await this.blogModel.findByIdAndDelete(id).exec();
       if(!result){
        throw new NotFoundException(`Blog with ID ${id} not Found`);
       }
    }
}
