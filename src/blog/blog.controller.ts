import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { Types } from 'mongoose';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {

    constructor(private  readonly blogService: BlogService){}

    @Post('create')
    create(@Body() createBlogDto: CreateBlogDto){
        return this.blogService.create(createBlogDto);
    }

    @Get('getAll')
    getAll() {
        return this.blogService.findAll();
    }

    @Get(':id')
    getById(@Param('id') id: Types.ObjectId){
        return this.blogService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id:Types.ObjectId, updateBlogDto:UpdateBlogDto) {
        return this.blogService.update(id, updateBlogDto);
    }

    @Delete(':id')
    remove(@Param('id') id: Types.ObjectId){
        return this.blogService.remove(id);
    }
    
}
