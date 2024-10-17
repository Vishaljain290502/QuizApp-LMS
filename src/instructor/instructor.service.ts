import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Instructor, InstructorDocument } from './instructor.schema';
import { Model, Types } from 'mongoose';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Injectable()
export class InstructorService {
    constructor(
        @InjectModel('Instructor') private readonly instructorModel : Model<InstructorDocument>
    ){}

    async create(createInstructorDto:CreateInstructorDto): Promise<Instructor> {
        const newInstructor = new this.instructorModel(createInstructorDto);
        return newInstructor.save();
    }

    async findAll(): Promise<Instructor[]> {
        return this.instructorModel.find().exec();
    }

    async findOne(id : Types.ObjectId): Promise<Instructor>{
        const instructor = this.instructorModel.findById(id).exec();
        if(!instructor){
            throw new NotFoundException(`Instructor with Id ${id} not Found`)
        }
        return instructor;
    }

    async update(id : Types.ObjectId, updateInstructorDto: UpdateInstructorDto): Promise<Instructor>{
        const updatedInstructor = this.instructorModel.findByIdAndUpdate(id).exec();
        if(!updatedInstructor){
            throw new NotFoundException(`Instructor with this ID ${id} not Found`)
        }
        return updatedInstructor;
    }

    async remove(id: Types.ObjectId): Promise<void>{
        const result = this.instructorModel.findByIdAndDelete(id).exec();
        if(!result){
            throw new NotFoundException(`Instructor with this ID ${id} not Found`)
        }
    }
}
