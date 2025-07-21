import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Request, Response } from 'express';


import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventsRoutes'
import bookingRoutes from './routes/bookingRoutes'
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:5173'
  })
); 

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
 app.use('/bookings', bookingRoutes);
 app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err: unknown, req: Request, res: Response) => {
  console.error('Global error handler:', err);

  res.status(500).json({
    message: 'Something went wrong',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

export default app;