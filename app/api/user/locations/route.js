import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import { authMiddleware } from '@/middleware/auth';

// Get locations for the current user
export async function GET(request) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status === 401) {
      return authResponse;
    }

    await connectDB();
    
    const userId = request.user.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let filter = { discoveredBy: userId };
    if (type) {
      filter.type = type;
    }

    const locations = await Location.find(filter)
      .sort({ createdAt: -1 });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching user locations:', error);
    return NextResponse.json(
      { error: 'Error fetching user locations' },
      { status: 500 }
    );
  }
}
