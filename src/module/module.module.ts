import { Module } from '@nestjs/common';
import { ModulesService } from './module.service';
import { ModulesController } from './module.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {  ModuleSchema } from './module.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:"Module",schema:ModuleSchema}])],
  providers: [ModulesService],
  controllers: [ModulesController]
})
export class ModuleModule {}
