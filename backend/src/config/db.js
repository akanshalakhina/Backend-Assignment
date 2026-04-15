const mongoose = require('mongoose');

async function connectDB(uri) {
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  // eslint-disable-next-line no-console
  console.log('✅ MongoDB connected');
}

module.exports = { connectDB };
