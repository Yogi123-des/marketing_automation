import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import MarketingGoal from '@/models/MarketingGoals';
import BusinessGoal from '@/models/BusinessGoals';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const goal = await MarketingGoal.findById(id).populate('businessGoalId', 'description revenueAimed');
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Marketing Goal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: goal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
  }
}


export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    if (body.businessGoalId) {
      const businessGoal = await BusinessGoal.findById(body.businessGoalId);
      if (!businessGoal) {
        return NextResponse.json({ success: false, error: 'Referenced Business Goal does not exist' }, { status: 404 });
      }
    }
    const goal = await MarketingGoal.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).populate('businessGoalId', 'description revenueAimed');
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Marketing Goal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: goal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const goal = await MarketingGoal.findById(id);
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Marketing Goal not found' }, { status: 404 });
    }
    await goal.deleteOne();
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}