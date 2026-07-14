import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import BusinessGoal from '@/models/BusinessGoals';


export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    let query = {};
    if (statusFilter) {
      query = { status: statusFilter };
    }
    const goals = await BusinessGoal.find(query);
    return NextResponse.json({ success: true, count: goals.length, data: goals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const newGoal = await BusinessGoal.create(body);
    return NextResponse.json({ success: true, data: newGoal }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}