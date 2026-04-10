import express from 'express';
import { register, login, logout } from '../controllers/auth.controller.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

export default router;
