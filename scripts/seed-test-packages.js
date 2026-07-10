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

// Schemas & Models
const LongTermRentalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['industrial-shed', 'yard', 'transport'],
    required: true,
  },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  duration: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['minutes', 'months', 'years'],
      required: true,
    },
  },
  returnPercentage: { type: Number, required: true },
  minHoldingPeriod: { type: Number, required: true },
  minHoldingPeriodUnit: {
    type: String,
    enum: ['seconds', 'minutes', 'months', 'years'],
    required: true,
  },
  resaleAllowed: { type: Boolean, default: false },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const LongTermRental = mongoose.models.LongTermRental || mongoose.model('LongTermRental', LongTermRentalSchema);

const LongTermIndustrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['property', 'cottage-industry', 'processing-plant', 'restaurant', 'banquet'],
      required: true,
    },
    totalUnits: { type: Number, required: true },
    availableUnits: { type: Number, required: true },
    equityUnits: { type: Number, required: true },
    estimatedReturn: { type: Number, required: true },
    minHoldingPeriod: { type: Number, required: true },
    minHoldingPeriodUnit: {
      type: String,
      enum: ['seconds', 'minutes', 'months', 'years'],
      required: true,
    },
    buybackOption: { type: Boolean, required: true },
    resaleAllowed: { type: Boolean, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);
const LongTermIndustry = mongoose.models.LongTermIndustry || mongoose.model('LongTermIndustry', LongTermIndustrySchema);

const TradingPackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['poultry', 'dairy', 'cattle', 'fruits-vegetables', 'automobiles', 'grocery', 'general', 'industrial-materials', 'catering', 'restaurant-goods'],
    required: true,
  },
  totalUnits: { type: Number, required: true },
  availableUnits: { type: Number, required: true },
  equityUnits: { type: Number, required: true },
  dailyInsights: { type: Boolean, default: true },
  profitEstimation: { type: String, enum: ['market-based'], required: true },
  returnPercentage: { type: Number, required: true },
  minHoldingPeriod: { type: Number, required: true },
  minHoldingPeriodUnit: { type: String, enum: ['seconds', 'minutes', 'months', 'years'], required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const TradingPackage = mongoose.models.TradingPackage || mongoose.model('TradingPackage', TradingPackageSchema);

const testRentals = [
  {
    name: "Solar Power Farm Rental",
    category: "industrial-shed",
    totalUnits: 500,
    availableUnits: 500,
    equityUnits: 25,
    duration: { value: 24, unit: "months" },
    returnPercentage: 18,
    minHoldingPeriod: 6,
    minHoldingPeriodUnit: "months",
    resaleAllowed: true,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Cold Storage Facility Rental",
    category: "industrial-shed",
    totalUnits: 300,
    availableUnits: 300,
    equityUnits: 40,
    duration: { value: 12, unit: "months" },
    returnPercentage: 14,
    minHoldingPeriod: 3,
    minHoldingPeriodUnit: "months",
    resaleAllowed: true,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Transport Truck Fleet",
    category: "transport",
    totalUnits: 150,
    availableUnits: 150,
    equityUnits: 75,
    duration: { value: 36, unit: "months" },
    returnPercentage: 20,
    minHoldingPeriod: 12,
    minHoldingPeriodUnit: "months",
    resaleAllowed: false,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
  }
];

const testIndustries = [
  {
    name: "Green Hydrogen Processing Plant",
    category: "processing-plant",
    totalUnits: 1000,
    availableUnits: 1000,
    equityUnits: 100,
    estimatedReturn: 22,
    minHoldingPeriod: 12,
    minHoldingPeriodUnit: "months",
    buybackOption: true,
    resaleAllowed: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Prestige Banquets & Events Hall",
    category: "banquet",
    totalUnits: 400,
    availableUnits: 400,
    equityUnits: 60,
    estimatedReturn: 16,
    minHoldingPeriod: 6,
    minHoldingPeriodUnit: "months",
    buybackOption: false,
    resaleAllowed: true,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Gourmet Fusion Restaurant Chain",
    category: "restaurant",
    totalUnits: 250,
    availableUnits: 250,
    equityUnits: 35,
    estimatedReturn: 15,
    minHoldingPeriod: 6,
    minHoldingPeriodUnit: "months",
    buybackOption: true,
    resaleAllowed: false,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
  }
];

const testTrading = [
  {
    name: "Livestock Cattle Trading",
    category: "cattle",
    totalUnits: 1200,
    availableUnits: 1200,
    equityUnits: 8,
    dailyInsights: true,
    profitEstimation: "market-based",
    returnPercentage: 25,
    minHoldingPeriod: 3,
    minHoldingPeriodUnit: "months",
    image: "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Premium Dairy Trade Plan",
    category: "dairy",
    totalUnits: 800,
    availableUnits: 800,
    equityUnits: 12,
    dailyInsights: true,
    profitEstimation: "market-based",
    returnPercentage: 18,
    minHoldingPeriod: 1,
    minHoldingPeriodUnit: "months",
    image: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Bulk Grain & Grocery Supply",
    category: "grocery",
    totalUnits: 2000,
    availableUnits: 2000,
    equityUnits: 4,
    dailyInsights: true,
    profitEstimation: "market-based",
    returnPercentage: 12,
    minHoldingPeriod: 15,
    minHoldingPeriodUnit: "minutes",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
  }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Insert Rentals
    console.log('Inserting LongTerm Rentals...');
    for (const item of testRentals) {
      const exists = await LongTermRental.findOne({ name: item.name });
      if (!exists) {
        await LongTermRental.create(item);
        console.log(`Created Rental: ${item.name}`);
      } else {
        console.log(`Rental package already exists: ${item.name}`);
      }
    }

    // Insert Industries
    console.log('Inserting LongTerm Industries...');
    for (const item of testIndustries) {
      const exists = await LongTermIndustry.findOne({ name: item.name });
      if (!exists) {
        await LongTermIndustry.create(item);
        console.log(`Created Industry: ${item.name}`);
      } else {
        console.log(`Industry package already exists: ${item.name}`);
      }
    }

    // Insert Trading
    console.log('Inserting Trading Packages...');
    for (const item of testTrading) {
      const exists = await TradingPackage.findOne({ name: item.name });
      if (!exists) {
        await TradingPackage.create(item);
        console.log(`Created Trading Package: ${item.name}`);
      } else {
        console.log(`Trading package already exists: ${item.name}`);
      }
    }

    console.log('Test packages seeded successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
