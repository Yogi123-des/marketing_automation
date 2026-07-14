import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import BusinessGoal from '@/models/BusinessGoals';
import MarketingGoal from '@/models/MarketingGoals';


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // Awaiting the Next.js 15 params!
    
    const goal = await BusinessGoal.findById(id);
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Business Goal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: goal });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Invalid ID format' }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params; // <--- Await the params!
    const body = await request.json();
    
    const goal = await BusinessGoal.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Business Goal not found' }, { status: 404 });
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
    const goal = await BusinessGoal.findById(id);
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Business Goal not found' }, { status: 404 });
    }
    await MarketingGoal.deleteMany({ businessGoalId: id });
    await goal.deleteOne();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Business Goal and all attached Marketing Goals were successfully deleted.' 
    });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}