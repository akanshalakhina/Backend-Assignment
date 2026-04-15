require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  await connectDB(process.env.MONGODB_URI);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 API server running at http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📘 Swagger docs at http://localhost:${PORT}/docs`);
  });
}

bootstrap();
