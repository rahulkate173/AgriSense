import imagekit from '../config/imagekit.js';
import axios from 'axios';

const FASTAPI_URL = 'http://agrisense-cnn-fastapi.onrender.com';

// ─────────────────────────────────────────────
// @desc    Upload plant image + run real ML prediction
// @route   POST /api/upload/uploadimg
// @access  Public
// ─────────────────────────────────────────────
export const uploadAndPredict = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Please upload a plant image.',
      });
    }

    const { originalname, buffer } = req.file;

    // Sanitise filename
    const timestamp = Date.now();
    const ext = originalname.split('.').pop();
    const fileName = `plant_${timestamp}.${ext}`;

    // ── Step 1: Upload to ImageKit ──
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName,
      folder: '/agrisense/plant-disease',
      useUniqueFileName: true,
      tags: ['plant-disease', 'agrisense'],
    });

    const imageUrl = uploadResponse.url;

    // ── Step 2: Call real FastAPI /predict endpoint with image_url as query param ──
    const prediction = await axios.post(
      `${FASTAPI_URL}/predict`,
      null,                          // no body needed
      {
        params: { image_url: imageUrl },
        timeout: 60000,
      }
    );

    const { class_label, confidence, response: mlResponse } = prediction.data;

    // ── Step 3: Return unified response ──
    return res.status(200).json({
      success: true,
      data: {
        imageUrl,
        class_label,
        confidence,
        response: mlResponse, // { english, hindi, marathi }
      },
    });
  } catch (error) {
    console.error('[uploadAndPredict] Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Upload or prediction failed. Please try again.',
    });
  }
};
