import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import ragRoutes from './routes/rag.routes.js';
import marketplaceRoutes from './routes/marketplace.routes.js';

const app = express()

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/rag', ragRoutes)
app.use('/api/marketplace', marketplaceRoutes)

export default app