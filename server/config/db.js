const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file. Please create a .env file with MONGO_URI variable.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are recommended for Mongoose 6+
      // Remove useNewUrlParser and useUnifiedTopology if using Mongoose 7+
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

