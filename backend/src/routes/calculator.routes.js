import express from 'express';
import { calculatePesticide } from '../controllers/calculator.controller.js';

const router = express.Router();

router.post('/calculate', calculatePesticide);

export default router;
