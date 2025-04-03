import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://abhishekdrai85:Abhishek29@cluster0.4kjtl.mongodb.net/hp?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/** 
 * Cached connection for MongoDB.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  console.log("Connected !")
  return cached.conn;
}

export default dbConnect;