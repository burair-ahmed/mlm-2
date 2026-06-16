const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env since dotenv is not in package.json
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

// Define inline schemas to avoid loading ESM TypeScript models in Node.js
const PermissionSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
  label: { type: String, required: true }
});
const Permission = mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission', required: true }]
});
const Role = mongoose.models.Role || mongoose.model('Role', RoleSchema);

const standardPermissions = [
  { slug: 'view_investments', label: 'View Purchased Packages' },
  { slug: 'view_commissions', label: 'View commissions' },
  { slug: 'view_referrals', label: 'View Referrals' },
  { slug: 'convert_units', label: 'Unit Converter' },
  { slug: 'view_kyc', label: 'View KYC submissions' },
  { slug: 'request_withdrawal', label: 'Request Withdrawal' },
  { slug: 'request_deposit', label: 'Request Deposit' },
  { slug: 'view_account', label: 'View Account' },
  { slug: 'manage_settings', label: 'Settings' },
  { slug: 'get_help', label: 'Get Help' },
  { slug: 'access_admin_dashboard', label: 'Access user dashboard' }
];

async function seed() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // 1. Seed standard permissions
    const permissionIds = [];
    for (const p of standardPermissions) {
      let doc = await Permission.findOne({ slug: p.slug });
      if (!doc) {
        doc = await Permission.create(p);
        console.log(`Created permission: ${p.slug}`);
      } else {
        console.log(`Permission already exists: ${p.slug}`);
      }
      permissionIds.push(doc._id);
    }

    // 2. Find or create the "User" role
    let userRole = await Role.findOne({ name: 'User' });
    if (!userRole) {
      userRole = await Role.create({
        name: 'User',
        permissions: permissionIds
      });
      console.log('Created User role');
    } else {
      // Update its permissions to include all of these
      userRole.permissions = permissionIds;
      await userRole.save();
      console.log('Updated User role permissions');
    }

    // 3. Find or create "Super Admin" and give it ALL permissions in the system
    let superAdminRole = await Role.findOne({ name: 'Super Admin' });
    const allPermissions = await Permission.find({});
    const allIds = allPermissions.map(p => p._id);
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'Super Admin',
        permissions: allIds
      });
      console.log('Created Super Admin role');
    } else {
      superAdminRole.permissions = allIds;
      await superAdminRole.save();
      console.log('Updated Super Admin role permissions');
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
