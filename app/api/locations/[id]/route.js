import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import { authMiddleware } from '@/middleware/auth';

// Get specific location
export async function GET(request, context) {
  try {
    await connectDB();

    const id = context.params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    const location = await Location.findById(id)
      .populate('discoveredBy', 'username')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'username'
        }
      });

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
export async function POST(request, context) {
  try {
    const authResponse = await authMiddleware(request.clone());
    if (authResponse.status !== 200) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const { id } = context.params;
    
    const { rating, comment, images = [] } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    const location = await Location.findById(id);
    if (!location) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }

    // Create new review
    const review = {
      user: authResponse.user._id,
      rating,
      comment,
      images
    };

    // Add review to location
    location.reviews.push(review);
    await location.save();

    // Populate user info for the new review
    await location.populate('reviews.user', 'username');
    const newReview = location.reviews[location.reviews.length - 1];

    return NextResponse.json({ 
      message: 'Review added successfully',
      review: newReview
    });
  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { error: error.message || 'Error adding review' },
      { status: 500 }
    );
  }
}
