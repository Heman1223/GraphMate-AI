import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface EnvConfig {
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  PORT: number;
  AI_SERVICE_URL: string;
  NODE_ENV: string;
}

const env: EnvConfig = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/graphmate',
  JWT_SECRET: process.env.JWT_SECRET || 'graphmate_super_secret_key_2024_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: parseInt(process.env.PORT || '5000', 10),
  AI_SERVICE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export default env;
