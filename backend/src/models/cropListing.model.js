import mongoose from 'mongoose';

const cropListingSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    farmerPhone: {
      type: String,
      required: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price per kg is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    // GeoJSON Point for geospatial queries (e.g. $geoNear)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    cityDistrict: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add a 2dsphere index on the location field to enable geospatial queries
cropListingSchema.index({ location: '2dsphere' });

export default mongoose.model('CropListing', cropListingSchema);
