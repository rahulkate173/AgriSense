import imagekit from '../config/imagekit.js';

// ─────────────────────────────────────────────
// Mock ML prediction function
// TODO: Replace with real ML API call to POST /predict later
// Expected ML response shape:
//   { stage, confidence, summary }
// ─────────────────────────────────────────────
const mockMLPredict = async (_imageUrl) => {
  // Simulate network latency of a real ML model
  await new Promise((r) => setTimeout(r, 800));

  const mockDiseases = [
    {
      stage: 'Early Blight',
      confidence: 0.87,
      summary:
        'The leaf shows early signs of fungal infection (Alternaria solani) with small brown spots surrounded by yellow halos. Treat with copper-based fungicide within 48 hours.',
      severity: 'moderate',
      recommendations: [
        'Apply copper-based fungicide spray',
        'Remove infected leaves immediately',
        'Avoid overhead irrigation',
        'Ensure proper plant spacing for airflow',
      ],
    },
    {
      stage: 'Late Blight',
      confidence: 0.91,
      summary:
        'Significant lesions detected indicating late blight (Phytophthora infestans). Dark water-soaked spots on leaves with white powdery growth on undersides.',
      severity: 'severe',
      recommendations: [
        'Apply systemic fungicide (metalaxyl) immediately',
        'Destroy heavily infected plants',
        'Do not compost infected material',
        'Monitor surrounding plants closely',
      ],
    },
    {
      stage: 'Healthy',
      confidence: 0.95,
      summary:
        'No signs of disease detected. The plant appears healthy with normal leaf coloration and texture. Continue regular monitoring.',
      severity: 'none',
      recommendations: [
        'Maintain regular watering schedule',
        'Continue weekly monitoring',
        'Ensure balanced fertilization',
      ],
    },
    {
      stage: 'Leaf Mold',
      confidence: 0.78,
      summary:
        'Pale yellowish spots visible on upper leaf surface with olive-green to grey mold growth on undersides, indicating Cladosporium fulvum infection.',
      severity: 'mild',
      recommendations: [
        'Improve greenhouse ventilation',
        'Reduce humidity levels below 85%',
        'Apply fungicide spray (chlorothalonil)',
        'Remove and destroy infected leaves',
      ],
    },
  ];

  // Pick a random mock result each time (simulates variable ML output)
  return mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
};

// ─────────────────────────────────────────────
// @desc    Upload plant image + run prediction
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

    const { originalname, buffer, mimetype } = req.file;

    // Sanitise filename
    const timestamp = Date.now();
    const ext = originalname.split('.').pop();
    const fileName = `plant_${timestamp}.${ext}`;

    // ── Step 1: Upload to ImageKit (no transformations) ──
    const uploadResponse = await imagekit.upload({
      file: buffer,           // raw buffer from multer memoryStorage
      fileName,
      folder: '/agrisense/plant-disease',
      useUniqueFileName: true,
      tags: ['plant-disease', 'agrisense'],
    });

    const imageUrl = uploadResponse.url; // plain CDN URL — no ?tr= params

    // ── Step 2: Run ML prediction (mocked for now) ──
    // TODO: Replace mockMLPredict with real call:
    //   const prediction = await axios.post(process.env.ML_API_URL + '/predict', { imageUrl });
    const prediction = await mockMLPredict(imageUrl);

    // ── Step 3: Return unified response ──
    return res.status(200).json({
      success: true,
      data: {
        imageUrl,
        stage:           prediction.stage,
        confidence:      prediction.confidence,
        summary:         prediction.summary,
        severity:        prediction.severity,
        recommendations: prediction.recommendations,
      },
    });
  } catch (error) {
    console.error('[uploadAndPredict] Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Upload or prediction failed. Please try again.',
    });
  }
};
