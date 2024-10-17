import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './lessons.schema';
import { Model, Types } from 'mongoose';
import { CreateLessonDto } from './dto/create-lessons.dto';
import { UpdateLessonDto } from './dto/update-lessons.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService){}

  @Post('create')
  create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get('getAll')
  findAll() {
    return this.lessonsService.findAll();
  }

  @Get('findById')
  findById(@Param(':id') id: Types.ObjectId){
     return this.lessonsService.findOne(id);
  }

  @Patch('update')
  update(@Param(':id') id: Types.ObjectId, @Body() updateLessonDto:UpdateLessonDto){
    return this.lessonsService.update(id,updateLessonDto);
  }

  @Delete('delete')
  delete(@Param(':id') id : Types.ObjectId){
    return  this.lessonsService.remove(id);
  }
}
