import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Configure Cloudinary SDK credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dsgoqckqh',
  api_key: process.env.CLOUDINARY_API_KEY || '916296356743892',
  api_secret: process.env.CLOUDINARY_API_SECRET || '3V6kamqm6A5D4SvJndPixK9Myu4'
});

// Middleware (Support large payloads for base64 image transfers!)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Session backed by MongoDB Atlas
const sessionOptions = {
  secret: 'axh-editions-premium-luxury-secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: MONGODB_URI.includes('<db_password>') 
      ? 'mongodb://localhost:27017/axh_local_sessions' 
      : MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60
  })
};

app.use(session(sessionOptions));

// Initialize MongoDB client
let db;
const client = new MongoClient(MONGODB_URI);

async function connectDB() {
  try {
    if (MONGODB_URI.includes('<db_password>')) {
      console.warn('⚠️  MONGODB_URI contains the "<db_password>" placeholder.');
      console.log('💡 Defaulting to developer mock mode...');
      return false;
    }
    
    await client.connect();
    db = client.db('axh_editions_db');
    console.log('🔌 Successfully connected to MongoDB Atlas Cluster!');
    await seedProductsCollection();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas Cluster:', error.message);
    console.log('💡 Defaulting to dev mock database fallback.');
    return false;
  }
}

// In-Memory Dev Fallbacks
let mockProducts = [
  {
    id: 'prod-001',
    name: 'Nürburgring Monochrome',
    category: 'posters',
    genre: 'MOTORSPORT',
    price: 45,
    image: '/motorsport_poster.png',
    stock: 12,
    serial: 'DROP 001 / ITEM 04',
    description: 'A high-contrast cinematic capture of the legendary Nürburgring Nordschleife Carousel, designed for ultra-clean minimalist interiors. Heavy archival print.',
    isDrop: true,
    isFeatured: true
  },
  {
    id: 'prod-002',
    name: 'Monaco Retro-Grand Prix',
    category: 'posters',
    genre: 'MOTORSPORT',
    price: 45,
    image: '/motorsport_poster.png',
    stock: 5,
    serial: 'DROP 001 / ITEM 01',
    description: 'Vintage Monte Carlo silhouettes combined with a deep indigo luxury modern overlay. Intentionally numbered volume edition.',
    isDrop: true
  },
  {
    id: 'prod-003',
    name: 'San Siro Golden Hour',
    category: 'posters',
    genre: 'FOOTBALL',
    price: 45,
    image: '/football_poster.png',
    stock: 8,
    serial: 'DROP 001 / ITEM 02',
    description: 'A geometric visual representation of San Siro stadium under deep amber lights. Crafted for modern football enthusiasts.',
    isDrop: true
  },
  {
    id: 'prod-004',
    name: 'Anfield Archival Print',
    category: 'framed',
    genre: 'FOOTBALL',
    price: 75,
    image: '/football_poster.png',
    stock: 15,
    serial: 'DROP 001 / ITEM 03',
    description: 'Matte black minimal framed edition of our iconic Anfield Kop silhouette. Arrives pre-mounted with protective museum-grade cover.',
    isDrop: true,
    isFeatured: true
  },
  {
    id: 'prod-005',
    name: 'A24 Cinematic Editorial',
    category: 'posters',
    genre: 'CINEMA',
    price: 50,
    image: '/motorsport_poster.png',
    stock: 20,
    serial: 'CATALOGUE / CORE',
    description: 'An abstract typographic poster celebrating independent cinema art culture. Soft ivory styling on premium black backdrop.',
    isDrop: false,
    isFeatured: true
  },
  {
    id: 'prod-006',
    name: 'Retro Synthwave Gaming',
    category: 'posters',
    genre: 'GAMING',
    price: 45,
    image: '/football_poster.png',
    stock: 14,
    serial: 'CATALOGUE / CORE',
    description: 'Neon indigo aesthetic layout celebrating retro arcade design culture and minimal grid styling.',
    isDrop: false
  },
  {
    id: 'prod-007',
    name: 'Motorsport Signature Stickers',
    category: 'stickers',
    genre: 'MOTORSPORT',
    price: 15,
    image: '/motorsport_poster.png',
    stock: 40,
    serial: 'DROP 001 / ACCS',
    description: 'A curated bundle of 5 mini collectible sticker packs featuring premium matte paper print and minimal motorsport silhouettes.',
    isDrop: false
  }
];

let mockOrders = [];
let mockCustomRequests = [];

async function seedProductsCollection() {
  const collection = db.collection('products');
  const count = await collection.countDocuments();
  if (count === 0) {
    console.log('🌱 Seeding default premium products to MongoDB Atlas...');
    await collection.insertMany(mockProducts);
    console.log('✅ Products successfully seeded!');
  }
}

// Connect to Atlas on boot
const isAtlasConnected = await connectDB();

// API Session-based Cart Endpoints
app.get('/api/cart', (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.status(200).json(req.session.cart);
});

app.post('/api/cart', (req, res) => {
  req.session.cart = req.body.cart || [];
  res.status(200).json({ success: true, cart: req.session.cart });
});

app.delete('/api/cart', (req, res) => {
  req.session.cart = [];
  res.status(200).json({ success: true, cart: [] });
});


// Admin Login & Logout Endpoints
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'axdedition@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'adminaxh1';
  
  if (email === adminEmail && password === adminPassword) {
    req.session.isAdmin = true;
    res.status(200).json({ success: true, message: 'Authorized Admin Access granted.' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid admin credentials.' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.isAdmin = false;
  res.status(200).json({ success: true, message: 'Admin logged out.' });
});

app.get('/api/admin/check', (req, res) => {
  res.status(200).json({ isAdmin: !!req.session.isAdmin });
});


// CRUD Products Controllers (Admin Authorized)
const adminAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized. Admin credentials required.' });
  }
};

// Base64 Cloudinary Upload Endpoint (Admin Only)
app.post('/api/admin/upload', adminAuth, async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image data payload provided.' });
    }

    console.log('📤 Uploading image base64 to Cloudinary...');
    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: 'axh_editions',
      resource_type: 'image'
    });

    console.log('✅ Image uploaded successfully to Cloudinary! URL:', uploadRes.secure_url);
    res.status(200).json({
      success: true,
      url: uploadRes.secure_url,
      publicId: uploadRes.public_id
    });
  } catch (err) {
    console.error('❌ Cloudinary upload failed:', err.message);
    res.status(500).json({ error: 'Failed to upload to Cloudinary', details: err.message });
  }
});

// Retrieve uploaded Cloudinary assets from axh_editions folder (Admin Only)
app.get('/api/admin/media', adminAuth, async (req, res) => {
  try {
    console.log('🔍 Fetching media assets from Cloudinary folder: axh_editions...');
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'axh_editions/',
      max_results: 100
    });

    // Sort by creation date descending
    const resources = (result.resources || []).sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    res.status(200).json({
      success: true,
      resources
    });
  } catch (err) {
    console.error('❌ Failed to retrieve Cloudinary assets:', err.message);
    res.status(500).json({ error: 'Failed to retrieve Cloudinary assets', details: err.message });
  }
});

// Get products list
app.get('/api/products', async (req, res) => {
  try {
    if (isAtlasConnected && db) {
      const collection = db.collection('products');
      const products = await collection.find({}).toArray();
      return res.status(200).json(products);
    } else {
      return res.status(200).json(mockProducts);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// CREATE [Admin]
app.post('/api/products', adminAuth, async (req, res) => {
  try {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: req.body.name,
      category: req.body.category,
      genre: req.body.genre || 'OTHER',
      price: Number(req.body.price),
      image: req.body.image || '/motorsport_poster.png',
      stock: Number(req.body.stock) || 10,
      serial: req.body.serial || 'CATALOGUE / CORE',
      description: req.body.description,
      isDrop: !!req.body.isDrop,
      isFeatured: !!req.body.isFeatured
    };

    if (isAtlasConnected && db) {
      const collection = db.collection('products');
      await collection.insertOne(newProduct);
    } else {
      mockProducts.push(newProduct);
    }

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  }
});

// UPDATE [Admin]
app.put('/api/products/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = {
      name: req.body.name,
      category: req.body.category,
      genre: req.body.genre,
      price: Number(req.body.price),
      image: req.body.image,
      stock: Number(req.body.stock),
      serial: req.body.serial,
      description: req.body.description,
      isDrop: !!req.body.isDrop,
      isFeatured: !!req.body.isFeatured
    };

    if (isAtlasConnected && db) {
      const collection = db.collection('products');
      await collection.updateOne({ id }, { $set: updates });
    } else {
      mockProducts = mockProducts.map(p => p.id === id ? { ...p, ...updates } : p);
    }

    res.status(200).json({ success: true, message: 'Product updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  }
});

// DELETE [Admin]
app.delete('/api/products/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    if (isAtlasConnected && db) {
      const collection = db.collection('products');
      await collection.deleteOne({ id });
    } else {
      mockProducts = mockProducts.filter(p => p.id !== id);
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  }
});


// Secure Checkout Orders Endpoint
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = {
      orderId: `AXH-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date(),
      items: req.body.items,
      total: req.body.total,
      discount: req.body.discount || 0,
      customer: req.body.customer || {}
    };

    if (isAtlasConnected && db) {
      const collection = db.collection('orders');
      await collection.insertOne(newOrder);
      
      const productsCol = db.collection('products');
      for (const item of newOrder.items) {
        if (item.productId && !item.productId.startsWith('custom-')) {
          await productsCol.updateOne(
            { id: item.productId },
            { $inc: { stock: -item.quantity } }
          );
        }
      }
    } else {
      mockOrders.push(newOrder);
    }

    req.session.cart = [];

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process order', details: error.message });
  }
});

// Bespoke Custom commissions registration
app.post('/api/custom-request', async (req, res) => {
  try {
    const customReq = {
      requestId: `CST-${Date.now()}`,
      createdAt: new Date(),
      theme: req.body.theme,
      size: req.body.size,
      framed: req.body.framed,
      details: req.body.details,
      price: req.body.price
    };

    if (isAtlasConnected && db) {
      const collection = db.collection('custom_requests');
      await collection.insertOne(customReq);
    } else {
      mockCustomRequests.push(customReq);
    }

    res.status(201).json({ success: true, request: customReq });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log bespoke request', details: error.message });
  }
});


// List dashboard data endpoints (Admin Only)
app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    if (isAtlasConnected && db) {
      const collection = db.collection('orders');
      const orders = await collection.find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(orders);
    } else {
      res.status(200).json(mockOrders);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders log', details: error.message });
  }
});

app.get('/api/admin/custom-requests', adminAuth, async (req, res) => {
  try {
    if (isAtlasConnected && db) {
      const collection = db.collection('custom_requests');
      const requests = await collection.find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(requests);
    } else {
      res.status(200).json(mockCustomRequests);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch custom requests', details: error.message });
  }
});


// Base Status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    brand: 'AXH EDITIONS',
    dbConnection: isAtlasConnected ? 'ATLAS_MONGO' : 'DEV_IN_MEMORY'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Premium AXH Backend running at http://localhost:${PORT}`);
});
