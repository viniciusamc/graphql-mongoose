import mongoose from 'mongoose';
import { env } from '../env';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(
      `mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_HOST}:${env.MONGO_PORT}/${env.MONGO_DB_NAME}?authSource=admin`,
    );

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
