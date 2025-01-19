import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import { authMiddleware } from '@/middleware/auth';

// Get all reviews by the current user
export async function GET(request) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status === 401) {
      return authResponse;
    }

    await connectDB();
    
    const userId = request.user.id;

    // Find all locations that have reviews by this user
    const locations = await Location.find({
      'reviews.user': userId
    }).select('name reviews');

    // Extract and format reviews
    const reviews = locations.flatMap(location => {
      const locationReviews = location.reviews.filter(
        review => review.user.toString() === userId
      );
      return locationReviews.map(review => ({
        ...review.toObject(),
        locationId: location._id,
        locationName: location.name
      }));
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json(
      { error: 'Error fetching user reviews' },
      { status: 500 }
    );
  }
}
