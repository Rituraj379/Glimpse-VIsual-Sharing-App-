import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import chatRoutes from './routes/chatRoutes.js';
import pinRoutes from './routes/pinRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',').map((item) => item.trim()) || '*',
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/chat', chatRoutes);

app.use((error, _req, res, _next) => {
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    message: error.message || 'Something went wrong',
  });
});

export default app;
