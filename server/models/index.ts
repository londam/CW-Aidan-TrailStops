import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const URL = process.env.MONGO_URL || 'mongodb://localhost:27017/TrailStops';

async function main() {
  await mongoose.connect(URL);
}

main();

export default mongoose;
