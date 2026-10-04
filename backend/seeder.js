const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const SEED_PRODUCTS = require('./src/data/seedProducts');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log('Cleared existing products...');

    await Product.insertMany(SEED_PRODUCTS);
    console.log(`Successfully seeded ${SEED_PRODUCTS.length} Flint Sector products into MongoDB Atlas!`);

    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('All products and orders destroyed from MongoDB.');

    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
