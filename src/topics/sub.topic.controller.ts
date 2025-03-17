import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { SubTopicService } from './sub.topic.service';
import { CreateSubTopicDto, UpdateSubTopicDto } from './dto/sub.topic.dto';
import { SubTopic } from './sub.topic.schema';

@ApiTags('Sub Topics')
@Controller('sub-topics')
export class SubTopicController {
  constructor(private readonly subTopicService: SubTopicService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new subtopic' })
  @ApiBody({ type: CreateSubTopicDto })
  @ApiResponse({ status: 201, description: 'The subtopic has been successfully created.', type: SubTopic })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(@Body() createSubTopicDto: CreateSubTopicDto): Promise<SubTopic> {
    return this.subTopicService.create(createSubTopicDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all subtopics' })
  @ApiResponse({ status: 200, description: 'List of all subtopics', type: [SubTopic] })
  async findAll(): Promise<SubTopic[]> {
    return this.subTopicService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a subtopic by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the subtopic to retrieve', example: '606c72b1f6d2c2a5b8b8e9b1' })
  @ApiResponse({ status: 200, description: 'The subtopic with the specified ID', type: SubTopic })
  @ApiResponse({ status: 404, description: 'Subtopic not found.' })
  async findById(@Param('id') id: string): Promise<SubTopic> {
    return this.subTopicService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing subtopic' })
  @ApiParam({ name: 'id', description: 'The ID of the subtopic to update', example: '606c72b1f6d2c2a5b8b8e9b1' })
  @ApiBody({ type: UpdateSubTopicDto })
  @ApiResponse({ status: 200, description: 'The updated subtopic', type: SubTopic })
  @ApiResponse({ status: 404, description: 'Subtopic not found.' })
  async update(@Param('id') id: string, @Body() updateSubTopicDto: UpdateSubTopicDto): Promise<SubTopic> {
    return this.subTopicService.update(id, updateSubTopicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a subtopic by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the subtopic to delete', example: '606c72b1f6d2c2a5b8b8e9b1' })
  @ApiResponse({ status: 200, description: 'The deleted subtopic', type: SubTopic })
  @ApiResponse({ status: 404, description: 'Subtopic not found.' })
  async delete(@Param('id') id: string): Promise<SubTopic> {
    return this.subTopicService.delete(id);
  }
}
