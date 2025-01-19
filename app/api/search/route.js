import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const sort = searchParams.get('sort');
    
    if (!query && !type) {
      return NextResponse.json(
        { error: 'Search query or type is required' },
        { status: 400 }
      );
    }

    // Build filter
    let filter = {};
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'address.city': { $regex: query, $options: 'i' } },
        { 'address.state': { $regex: query, $options: 'i' } },
        { 'address.country': { $regex: query, $options: 'i' } }
      ];
    }
    
    if (type) {
      filter.type = type;
    }

    // Build sort options
    let sortOptions = {};
    switch (sort) {
      case 'rating':
        sortOptions.averageRating = -1;
        break;
      case 'reviews':
        sortOptions = { 'reviews.length': -1 };
        break;
      case 'recent':
        sortOptions.createdAt = -1;
        break;
      default:
        // Default sort by relevance (if search query exists) or date
        sortOptions = query ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
    }

    const locations = await Location.find(filter)
      .populate('discoveredBy', 'username')
      .sort(sortOptions)
      .limit(20);

    return NextResponse.json({ 
      locations,
      total: locations.length
    });
  } catch (error) {
    console.error('Error searching locations:', error);
    return NextResponse.json(
      { error: 'Error searching locations' },
      { status: 500 }
    );
  }
}
