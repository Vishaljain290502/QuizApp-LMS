import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectModel('Student') private readonly studentModel : Model<StudentDocument>
    ) {}

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const newStudent  = new this.studentModel(createStudentDto);
        return newStudent.save();
    }

    async findAll(): Promise<Student[]> {
        return this.studentModel.find().exec();
    }

    async findOne(id: Types.ObjectId): Promise<Student> {
        const student = await this.studentModel.findById(id).exec();
    if(!student) {
        throw new NotFoundException(`Student With Id ${id} Not Found`);
    }
    return student;
    }

    async update(id: Types.ObjectId, updateStudentDto:UpdateStudentDto) : Promise<Student> {
        const updatedStudents = await this.studentModel.findByIdAndUpdate(id, updateStudentDto, {new: true}).exec();
        if(!updatedStudents){
            throw new NotFoundException(`Student with Id ${id} not found`)
        }
        return updatedStudents;
    }

    async remove(id: Types.ObjectId): Promise<void>{
        const result = this.studentModel.findOneAndDelete(id).exec();
        if(!result){
            throw new NotFoundException(`Student with this Id${id} is not found`)
        }
    }
}
