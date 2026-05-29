import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

const imageMap = {
  '/motorsport_poster.png': 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096507/axh_editions_static/motorsport_poster.jpg',
  '/football_poster.png': 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096505/axh_editions_static/football_poster.jpg',
  '/hamilton_poster.png': 'https://res.cloudinary.com/dsgoqckqh/image/upload/v1780096506/axh_editions_static/hamilton_poster.png'
};

async function updateDB() {
  try {
    await client.connect();
    const db = client.db('axh_editions_db');
    const collection = db.collection('products');
    
    console.log('🔌 Connected to MongoDB Atlas. Starting image migration...');
    
    for (const [oldPath, newUrl] of Object.entries(imageMap)) {
      const query = { image: oldPath };
      const update = { $set: { image: newUrl } };
      const result = await collection.updateMany(query, update);
      console.log(`✅ Updated ${result.modifiedCount} documents for old path: ${oldPath} -> ${newUrl}`);
    }
    
    console.log('🎉 Database image migration completed successfully!');
  } catch (err) {
    console.error('❌ Database update failed:', err.message);
  } finally {
    await client.close();
  }
}

updateDB();
