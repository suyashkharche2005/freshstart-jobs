import mongoose from 'mongoose';
export const connectDB = async (uri = process.env.MONGODB_URI) => {
  if (!uri) throw new Error('MONGODB_URI is not configured');
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};
