import {z} from 'zod';

export const CampaignSchema = z.object({
    topic: z.string().min(5, { message: 'Topic must be at least 5 characters long' }).max(100, { message: 'Topic must be at most 100 characters long' }),
    buyerPersona: z.string().min(15, { message: 'Buyer persona must be at least 15 characters long' }).max(120, { message: 'Buyer persona must be at most 120 characters long' }),
})