import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './lessons.schema';
import { Model, Types } from 'mongoose';
import { CreateLessonDto } from './dto/create-lessons.dto';
import { UpdateLessonDto } from './dto/update-lessons.dto';

@Injectable()
export class LessonsService {

    constructor(
        @InjectModel('Lesson') private readonly lessonModel: Model<LessonDocument>
    ){}

    async create( createLessonDto:CreateLessonDto): Promise<Lesson>{
        const newLesson = new this.lessonModel(createLessonDto);
        return newLesson;
    }

    async findAll(): Promise<Lesson[]>{
        return this.lessonModel.find().populate('module').exec();
    }

    async findOne(id: Types.ObjectId): Promise<Lesson> {
        const lesson = await this.lessonModel.findById(id).exec();
        if(!lesson){
            throw new NotFoundException(`Lesson with Id ${id} not Found`);
        }
        return lesson;
    }

    async update(id: Types.ObjectId, updateLessonDto: UpdateLessonDto): Promise<Lesson>{
        const updatedLesson = await this.lessonModel.findByIdAndUpdate(id, updateLessonDto, {new:true}).exec();
        if(!updatedLesson){
            throw new NotFoundException(`Lesson with Id ${id} Not Found`)
        }
        return updatedLesson;
    } 

    async remove(id: Types.ObjectId): Promise<void>{
        const result = await this.lessonModel.findByIdAndDelete(id).exec();
        if(!result){
            throw new NotFoundException(`Lesson with Id ${id} Not Found`)
        }
    }
}
