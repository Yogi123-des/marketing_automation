import mongoose, { Schema, Document } from 'mongoose';


export interface IMarketingGoal extends Document {
  description: string;
  leadsTargeted: number;
  businessGoalId: mongoose.Types.ObjectId;
}


const MarketingGoalSchema: Schema = new Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    leadsTargeted: {
      type: Number,
      required: [true, 'Number of leads targeted is required'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value',
      },
      min: [0, 'Leads targeted must be a positive integer'],
    },
    businessGoalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusinessGoal',
      required: [true, 'Business Goal reference is required'],
    },
  },
  { timestamps: true }
);


export default mongoose.models.MarketingGoal || mongoose.model<IMarketingGoal>('MarketingGoal', MarketingGoalSchema);