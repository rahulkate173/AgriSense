import express from 'express';
import multer from 'multer';
import { uploadPDF, chat, getHistory } from '../controllers/rag.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Memory storage for multer (buffer used by pdf-parse)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
});

router.post('/uploadpdf', protect, upload.single('file'), uploadPDF);
router.post('/chat', protect, chat);
router.get('/history/:userId/:sessionId', protect, getHistory);

export default router;
