import { Campaign } from "@/models/Campaign";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: any;
    campaigns?: Array<Campaign>;
    data?: any;
}