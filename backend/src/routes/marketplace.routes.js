import express from 'express';
import { listCrop, getNearbyCrops } from '../controllers/marketplace.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import upload from '../config/multer.js';

const router = express.Router();

// @route   POST /api/marketplace/list
// @access  Protected (Farmer)
router.post('/list', protect, upload.single('image'), listCrop);

// @route   GET /api/marketplace/nearby
// @access  Protected (User/Buyer)
router.get('/nearby', protect, getNearbyCrops);

export default router;
