import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Location from '@/models/Location';
import Review from '@/models/Review';
import { authMiddleware } from '@/middleware/auth';

// Get reviews for a location
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

    const location = await Location.findById(id).populate({
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

    return NextResponse.json({ reviews: location.reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Error fetching reviews' },
      { status: 500 }
    );
  }
}

// Add a review
export async function POST(request, context) {
  try {
    const user = await authMiddleware(request.clone());
    
    if (!user || !user._id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    const id = context.params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'Location ID is required' },
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

    const reviewData = await request.json();

    // Validate required fields
    if (!reviewData.rating || !reviewData.comment) {
      return NextResponse.json(
        { error: 'Rating and comment are required' },
        { status: 400 }
      );
    }

    // Create new review
    const review = new Review({
      location: location._id,
      user: user._id,
      rating: reviewData.rating,
      comment: reviewData.comment,
      images: reviewData.images || []
    });

    await review.save();

    // Add review to location
    location.reviews.push(review._id);

    // Update location's average rating
    const allReviews = await Review.find({ location: location._id });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    location.averageRating = totalRating / allReviews.length;

    await location.save();

    // Populate user details before sending response
    await review.populate('user', 'username');

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Error creating review' },
      { status: 500 }
    );
  }
}
