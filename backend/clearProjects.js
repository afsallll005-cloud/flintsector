const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');

dotenv.config();

const clearProducts = async () => {
  try {
    await connectDB();
    const result = await Product.deleteMany({});
    console.log(`Successfully removed ${result.deletedCount} products from the database.`);
    process.exit(0);
  } catch (error) {
    console.error(`Error clearing products: ${error.message}`);
    process.exit(1);
  }
};

clearProducts();
