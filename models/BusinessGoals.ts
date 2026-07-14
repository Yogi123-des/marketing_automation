import mongoose, { Schema, Document } from 'mongoose';


export interface IBusinessGoal extends Document {
  description: string;
  revenueAimed: number;
}


const BusinessGoalSchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    revenueAimed: {
      type: Number,
      required: [true, 'Revenue aimed is required'],
      min: [0, 'Revenue aimed must be a positive number'],
    },
    status: {
      type: String,
      enum: ['Active', 'Achieved', 'Scrapped'],
      default: 'Active',
    }
  },
  { timestamps: true }
);


export default mongoose.models.BusinessGoal || mongoose.model<IBusinessGoal>('BusinessGoal', BusinessGoalSchema);