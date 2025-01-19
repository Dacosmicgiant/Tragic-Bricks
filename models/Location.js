import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    validate: {
      validator: Number.isInteger,
      message: 'Rating must be a whole number'
    }
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters long']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return v.startsWith('http://') || v.startsWith('https://');
      },
      message: 'Invalid image URL'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a location name'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters long']
  },
  type: {
    type: String,
    required: true,
    enum: {
      values: ['abandoned', 'haunted', 'unknown'],
      message: '{VALUE} is not a valid location type'
    },
    lowercase: true
  },
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide a state'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Please provide a country'],
      trim: true
    }
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: true,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  images: {
    type: [{
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return v.startsWith('http://') || v.startsWith('https://');
        },
        message: 'Invalid image URL'
      }
    }],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Please provide at least one image'
    }
  },
  discoveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate average rating before saving
locationSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const total = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((total / this.reviews.length) * 10) / 10;
  } else {
    this.averageRating = 0;
  }
  next();
});

// Add text index for search
locationSchema.index({
  name: 'text',
  description: 'text',
  'address.city': 'text',
  'address.state': 'text',
  'address.country': 'text'
});

const Location = mongoose.models.Location || mongoose.model('Location', locationSchema);

export default Location;
