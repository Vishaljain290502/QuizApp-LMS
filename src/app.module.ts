import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperModule } from './helper/helper.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';

@Module({
  imports: [
    ProductsModule,
    CategoriesModule,
    SubcategoriesModule,
    MongooseModule.forRoot('mongodb+srv://vishaljaurasoft:uWkjdnz06DQ2zDKg@cluster0.lcqe8e7.mongodb.net/rydr?retryWrites=true&w=majority&appName=Cluster0'), HelperModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
