import express from 'express';
import upload from '../config/multer.js';
import { uploadAndPredict } from '../controllers/upload.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/upload/uploadimg
// Field name must be "image" in the FormData
router.post('/uploadimg', protect, upload.single('image'), uploadAndPredict);

export default router;
