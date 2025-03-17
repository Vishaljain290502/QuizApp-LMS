import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { WalletDocument } from '../wallet/wallet.schema'; 


@Schema()
export class UserDocument {
  @Prop()
  name: string;

  @Prop()
  dob: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token: string;

  @Prop()
  mobileNumber: string;

  @Prop()
  city:string;

  @Prop()
  state:string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  resetTokenExpiration: Date;

  @Prop()
  otp: string;

  @Prop()
  address: string;

  @Prop({ default: [] })
  quizzesCompleted: mongoose.Types.ObjectId[]; 
  
  @Prop({ default: [] })
  coursesEnrolled: mongoose.Types.ObjectId[]; 

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' })
  wallet: mongoose.Types.ObjectId;


   /**
   * 🎉 New Payment Details Section
   */
   @Prop()
   bankName: string;
 
   @Prop()
   accountHolderName: string;
 
   @Prop()
   accountNumber: string;
 
   @Prop()
   ifscCode: string;
 
   @Prop([String])
   upiIds: string[]; 

  /**
   * Adds a quiz to the user's completed list.
   * @param quizId - The ID of the quiz to add.
   */
  completeQuiz(quizId: mongoose.Types.ObjectId) {
    if (!this.quizzesCompleted.includes(quizId)) {
      this.quizzesCompleted.push(quizId);
    }
  }


  

  /**
   * Enrolls the user in a course.
   * @param courseId - The ID of the course to enroll in.
   */
  enrollCourse(courseId: mongoose.Types.ObjectId) {
    if (!this.coursesEnrolled.includes(courseId)) {
      this.coursesEnrolled.push(courseId);
    }
  }
}

export type User = HydratedDocument<UserDocument>;

export const userSchema = SchemaFactory.createForClass(UserDocument);
