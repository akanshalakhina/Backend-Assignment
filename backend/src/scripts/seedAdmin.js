require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connectDB } = require('../config/db');
const User = require('../modules/user/user.model');

async function seed() {
  await connectDB(process.env.MONGODB_URI);

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    // eslint-disable-next-line no-console
    console.log('Admin already exists');
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name: 'Admin User', email, password: hashed, role: 'admin' });

  // eslint-disable-next-line no-console
  console.log(`Admin seeded with email: ${email}`);
  process.exit(0);
}

seed();
