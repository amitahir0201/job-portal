require('dotenv').config();
require('express-async-errors');
const app = require('./app');
const connectDB = require('./config/db');
const seedAdmin = require('./seeds/seedAdmin');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    
    // Seed admin user on startup
    await seedAdmin();
    
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();