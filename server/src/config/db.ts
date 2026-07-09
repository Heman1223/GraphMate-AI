import mongoose from 'mongoose';
import env from './env';

const connectDB = async (): Promise<void> => {
  const MAX_RETRIES = 5;
  let retries = 0;

  const connect = async (): Promise<void> => {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection attempt ${retries}/${MAX_RETRIES} failed:`, (error as Error).message);
      if (retries < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, retries), 30000);
        console.log(`⏳ Retrying in ${delay / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return connect();
      }
      console.error('💀 Max retries reached. Exiting...');
      process.exit(1);
    }
  };

  mongoose.connection.on('connected', () => {
    console.log('📡 Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('🔴 Mongoose connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose disconnected from DB');
  });

  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('👋 Mongoose connection closed through app termination');
    process.exit(0);
  });

  await connect();
};

export default connectDB;
