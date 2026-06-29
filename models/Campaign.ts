import mongoose, { Schema, Document, Model } from 'mongoose';

export interface Campaign extends Document {
    userId: mongoose.Types.ObjectId;
    topic: string;
    buyerPersona: string;
    headline: string;
    subheading: string;
    article: string;
    socialPosts: string[];
    createdAt: Date;
    updatedAt: Date;
}

const campaignSchema: Schema<Campaign> = new Schema({
    userId: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true,
    },
    topic: { 
        type: String, 
        required: [true, 'Topic is required'],},
    buyerPersona: { 
        type: String,
        required: [true, 'Buyer persona is required'], 
    },
    headline: { 
        type: String, 
        required: true, },
    subheading: { 
        type: String, 
        required: true, },
    article: {
        type: String,
        required: true,
    },
    socialPosts: {
        type: [String],
        required: true,
    },
}, { timestamps: true });

const CampaignModel: Model<Campaign> = mongoose.model<Campaign>('Campaign', campaignSchema);

export default CampaignModel;