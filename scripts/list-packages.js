const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim();
      process.env[key] = val;
    }
  });
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));

    // Get count for each package collection if they exist
    for (const name of ['longtermrentals', 'longtermindustries', 'tradingpackages', 'equitypackages', 'shorttermpackages']) {
      try {
        const count = await mongoose.connection.db.collection(name).countDocuments();
        console.log(`Collection ${name} count: ${count}`);
      } catch (err) {
        console.log(`Collection ${name} could not be queried: ${err.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
