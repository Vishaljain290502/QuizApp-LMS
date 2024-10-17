import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { Types } from 'mongoose';
import { UpdateInstructorDto } from './dto/update-instructor.dto';

@Controller('instructor')
export class InstructorController {

    constructor(private readonly instructorService: InstructorService){}

    @Post('create')
    create(@Body() createInstructorDto: CreateInstructorDto){
        return this.instructorService.create(createInstructorDto);
    }

    @Get('findAll')
    findAll() {
        return this.instructorService.findAll();
    }

    @Get(':id')
    findByID(@Param('id') id:Types.ObjectId) {
        return this.instructorService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: Types.ObjectId, @Body() updateInstructorDto: UpdateInstructorDto) {
        return this.instructorService.update(id, updateInstructorDto);
    }

    @Delete('id')
    remove(@Param('id') id: Types.ObjectId) {
        return this.instructorService.remove(id);
    }

}
