import mongoose from 'mongoose';
import { env } from '../env';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(env.MONGODB_URL);

    const { host, port, name } = connection.connection;
    console.log(host, port, name);

    mongoose.connection.on('close', () => {
      process.exit(1);
    });
  } catch (error) {
    console.error('mongodb error');
    throw error;
  }
};
