import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import ragRoutes from './routes/rag.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';
import calculatorRoutes from './routes/calculator.routes.js';

const app = express()

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://agri-sense-zeta.vercel.app',
  process.env.FRONTEND_URL?.replace(/\/$/, '') || 'https://agri-sense-zeta.vercel.app'
];
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
}));

// Handle preflight requests for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/rag', ragRoutes)
app.use('/api/marketplace', marketplaceRoutes)
app.use('/api/calculator', calculatorRoutes)


// 404 handler (Express compatible)
app.get('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

export default app
