import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import { authMiddleware } from '@/middleware/auth';

// Get specific location
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const location = await Location.findById(params.id)
      .populate('discoveredBy', 'username')
      .populate('reviews.user', 'username');

    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ location });
  } catch (error) {
    console.error('Error fetching location:', error);
    return NextResponse.json(
      { error: 'Error fetching location' },
      { status: 500 }
    );
  }
}

// Add review to location
export async function POST(request, { params }) {
  try {
    const authResponse = await authMiddleware(request);
    if (authResponse.status === 401) {
      return authResponse;
    }

    await connectDB();
    
    const { rating, comment, images = [] } = await request.json();
    const userId = request.user.id;

    const location = await Location.findById(params.id);
    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed
    const existingReview = location.reviews.find(
      review => review.user.toString() === userId
    );
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this location' },
        { status: 400 }
      );
    }

    location.reviews.push({
      user: userId,
      rating,
      comment,
      images
    });

    // Recalculate average rating
    location.averageRating = location.reviews.reduce((acc, review) => acc + review.rating, 0) / location.reviews.length;

    await location.save();
    await location.populate('reviews.user', 'username');

    return NextResponse.json(
      { message: 'Review added successfully', location },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: 'Error adding review' },
      { status: 500 }
    );
  }
}
