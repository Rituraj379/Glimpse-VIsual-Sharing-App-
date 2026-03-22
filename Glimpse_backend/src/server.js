import dotenv from 'dotenv';

import app from './app.js';
import { connectToDatabase } from './config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Glimpse backend running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
