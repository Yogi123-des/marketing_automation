import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import MarketingGoal from '@/models/MarketingGoals';
import BusinessGoal from '@/models/BusinessGoals'; // Needed to verify the relation


export async function GET() {
  try {
    await connectDB();
    // Populate replaces the businessGoalId with the actual Business Goal object data
    const goals = await MarketingGoal.find().populate('businessGoalId', 'description revenueAimed');
    return NextResponse.json({ success: true, count: goals.length, data: goals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    // Check if the referenced Business Goal exists
    const businessGoal = await BusinessGoal.findById(body.businessGoalId);
    if (!businessGoal) {
      return NextResponse.json({ success: false, error: 'Referenced Business Goal does not exist' }, { status: 404 });
    }
    const newGoal = await MarketingGoal.create(body);
    return NextResponse.json({ success: true, data: newGoal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}