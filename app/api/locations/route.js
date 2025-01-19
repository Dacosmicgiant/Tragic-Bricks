import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import { authMiddleware } from '@/middleware/auth';

// Get all locations with optional filtering
export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const query = searchParams.get('query');
    
    let filter = {};
    if (type) {
      filter.type = type;
    }
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    const locations = await Location.find(filter)
      .populate('discoveredBy', 'username')
      .sort({ createdAt: -1 });

    return NextResponse.json({ locations });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Error fetching locations' },
      { status: 500 }
    );
  }
}

// Create new location
export async function POST(request) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status === 401) {
      return authResponse;
    }

    await connectDB();
    
    const locationData = await request.json();
    locationData.discoveredBy = request.user.id;

    const location = await Location.create(locationData);
    await location.populate('discoveredBy', 'username');

    return NextResponse.json(
      { message: 'Location created successfully', location },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Error creating location' },
      { status: 500 }
    );
  }
}
