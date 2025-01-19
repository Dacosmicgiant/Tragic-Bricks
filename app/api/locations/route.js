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
    const sort = searchParams.get('sort');
    const query = searchParams.get('search');
    
    let filter = {};
    let sortOptions = { createdAt: -1 }; // Default sort by newest

    // Apply type filter
    if (type && type !== 'all') {
      filter.type = type.toLowerCase();
    }

    // Apply search filter
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ];
    }

    // Apply sort
    if (sort) {
      switch (sort) {
        case 'reviews':
          sortOptions = { 'reviews.length': -1, averageRating: -1 };
          break;
        case 'rating':
          sortOptions = { averageRating: -1 };
          break;
        case 'recent':
          sortOptions = { createdAt: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    const locations = await Location.find(filter)
      .populate('discoveredBy', 'username')
      .sort(sortOptions);

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
    const user = await authMiddleware(request.clone());
    
    if (!user || !user._id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const locationData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'type', 'address', 'coordinates'];
    for (const field of requiredFields) {
      if (!locationData[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create location with user ID
    const location = new Location({
      ...locationData,
      discoveredBy: user._id,
      type: locationData.type.toLowerCase(),
      reviews: [],
      averageRating: 0
    });

    await location.save();

    // Populate user details before sending response
    await location.populate('discoveredBy', 'username');

    return NextResponse.json({ location }, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Error creating location' },
      { status: 500 }
    );
  }
}
