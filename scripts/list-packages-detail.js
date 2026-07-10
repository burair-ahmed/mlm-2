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

    for (const name of ['longtermrentals', 'longtermindustries', 'tradingpackages', 'equitypackages', 'shorttermpackages']) {
      try {
        const docs = await mongoose.connection.db.collection(name).find({}).toArray();
        console.log(`\n--- Collection: ${name} (count: ${docs.length}) ---`);
        docs.forEach(d => {
          console.log(`ID: ${d._id}, Name: ${d.name || d.label}, Category: ${d.category}, Total: ${d.totalUnits}, Avail: ${d.availableUnits}, EquityUnits: ${d.equityUnits}`);
        });
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
