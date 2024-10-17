import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import {  CreateStudentDto } from './dto/create-student.dto';
import { Types } from 'mongoose';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post('create')
    create(@Body() createStudentDto:CreateStudentDto){
        return this.studentService.create(createStudentDto);
    }

    @Get('getAll')
    findAll() {
        return this.studentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: Types.ObjectId){
        return this.studentService.findOne(id);
    }

    @Patch(':id')
    update(@Param(':id') id: Types.ObjectId, @Body() updateStudentDto : UpdateStudentDto){
        return this.studentService.update(id, updateStudentDto);
    }

    @Delete(':id')
    remove(@Param('id') id: Types.ObjectId){
    return this.studentService.remove(id);
    }
}
