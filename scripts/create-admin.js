const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Parse .env
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

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  isAdmin: { type: Boolean, default: false }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function run() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Update Burair@example.com password
    const admin = await User.findOne({ email: 'Burair@example.com' });
    if (admin) {
      admin.password = hashedPassword;
      await admin.save();
      console.log('Updated Burair@example.com password to password123');
    } else {
      console.log('Burair@example.com admin not found');
    }

    // Update abc@xyz.abc password
    const user = await User.findOne({ email: 'abc@xyz.abc' });
    if (user) {
      user.password = hashedPassword;
      await user.save();
      console.log('Updated abc@xyz.abc password to password123');
    } else {
      console.log('abc@xyz.abc user not found');
    }

  } catch (error) {
    console.error('Error running script:', error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
