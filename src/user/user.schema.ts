import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WalletDocument } from '../wallet/wallet.schema';  

@Schema({ timestamps: true })
export class UserDocument {
  @Prop()
  name: string;

  @Prop()
  dob: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: String, default: null }) 
  profilePic: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token: string;

  @Prop()
  mobileNumber: string;

  @Prop({ default: "" })
  notificationToken: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

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

  @Prop({ type: [Types.ObjectId], default: [] })
  quizzesCompleted: Types.ObjectId[]; 

  @Prop({ type: [Types.ObjectId], default: [] })
  coursesEnrolled: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Quiz' }] })
  joinedQuizzes: Types.ObjectId[];
  
  @Prop({ type: Types.ObjectId, ref: 'Wallet' })
  wallet: Types.ObjectId;

  // 🎉 New Payment Details Section
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
  completeQuiz(quizId: Types.ObjectId) {
    if (!this.quizzesCompleted.includes(quizId)) {
      this.quizzesCompleted.push(quizId);
    }
  }

  /**
   * Enrolls the user in a course.
   * @param courseId - The ID of the course to enroll in.
   */
  enrollCourse(courseId: Types.ObjectId) {
    if (!this.coursesEnrolled.includes(courseId)) {
      this.coursesEnrolled.push(courseId);
    }
  }

  /**
   * Joins a quiz (adds it to the user's joined quizzes).
   * @param quizId - The ID of the quiz to join.
   */
  joinQuiz(quizId: Types.ObjectId) {
    if (!this.joinedQuizzes.includes(quizId)) {
      this.joinedQuizzes.push(quizId);
    }
  }
}

export type User = HydratedDocument<UserDocument>;

export const userSchema = SchemaFactory.createForClass(UserDocument);
