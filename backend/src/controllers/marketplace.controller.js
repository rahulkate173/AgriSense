import CropListing from '../models/cropListing.model.js';
import imagekit from '../config/imagekit.js';

// @desc    List a new crop for sale
// @route   POST /api/marketplace/list
// @access  Protected
export const listCrop = async (req, res) => {
  try {
    const { cropName, price, quantity, description, lat, lng, cityDistrict, farmerName, farmerPhone } = req.body;

    if (!cropName || !price || !quantity || !lat || !lng) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let imageUrl = '';

    if (req.file) {
      const { originalname, buffer } = req.file;
      const timestamp = Date.now();
      const ext = originalname.split('.').pop();
      const fileName = `crop_${timestamp}.${ext}`;

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName,
        folder: '/agrisense/marketplace',
        useUniqueFileName: true,
      });

      imageUrl = uploadResponse.url;
    }

    const newListing = await CropListing.create({
      farmerId: req.user._id,
      farmerName: farmerName || req.user.fullName,
      farmerPhone: farmerPhone || req.user.phone || 'N/A',
      cropName,
      price: Number(price),
      quantity: Number(quantity),
      description,
      imageUrl,
      cityDistrict,
      location: {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)]
      }
    });

    res.status(201).json({
      success: true,
      data: newListing,
      message: 'Crop listed successfully!'
    });
  } catch (error) {
    console.error('[listCrop] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get nearby crops for sale
// @route   GET /api/marketplace/nearby
// @access  Protected
export const getNearbyCrops = async (req, res) => {
  try {
    const { lat, lng, radiusKm, search } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const maxDistance = (Number(radiusKm) || 50) * 1000; // Convert km to meters (default 50km)

    // Build the $geoNear pipeline
    const pipeline = [
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [Number(lng), Number(lat)]
          },
          distanceField: 'distance', // this will be in meters
          maxDistance: maxDistance,
          spherical: true
        }
      }
    ];

    // If there's a search term, filter crops by name
    if (search && search.trim() !== '') {
      pipeline.push({
        $match: {
          cropName: { $regex: search, $options: 'i' }
        }
      });
    }

    // Sort by distance ascending implicitly done by $geoNear, but we can add sort stage if needed.
    // $geoNear automatically sorts document by distance from nearest to farthest.

    const nearbyCrops = await CropListing.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: nearbyCrops.length,
      data: nearbyCrops
    });
  } catch (error) {
    console.error('[getNearbyCrops] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};
