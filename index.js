const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
require('dotenv').config();
const userRoutes = require('./Routes/UserRoute'); // Import your user route module

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Replaces bodyParser.json() as it's natively supported
app.use(cookieParser());

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('Mongo URI is missing!');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define your routes here
app.use('/api', userRoutes); // Use the userRoutes for the registration endpoint

// Start server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});