import app from './app';
import { connectDatabase } from '../src/config/database'

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const dbConnected = await connectDatabase();
    
    if (!dbConnected) {
      console.error('Failed to connect to database');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();