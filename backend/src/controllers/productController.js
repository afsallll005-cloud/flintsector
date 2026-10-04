const Product = require('../models/Product');
const SEED_PRODUCTS = require('../data/seedProducts');

// Helper to slugify product name if ID not provided
const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// @desc    Get all products (with optional auto-seeding if empty)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, bestseller, newDrop } = req.query;

    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { color: { $regex: search, $options: 'i' } },
      ];
    }
    if (bestseller === 'true') {
      filter.isBestseller = true;
    }
    if (newDrop === 'true') {
      filter.isNew = true;
    }

    let products = await Product.find(filter).sort({ createdAt: -1 });

    // Auto-seed if database has 0 products
    if (products.length === 0 && Object.keys(filter).length === 0) {
      const count = await Product.countDocuments();
      if (count === 0) {
        console.log('Seeding initial products into database...');
        await Product.insertMany(SEED_PRODUCTS);
        products = await Product.find().sort({ createdAt: -1 });
      }
    }

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    // If DB is temporarily offline, return seed fallback
    res.status(200).json({
      success: true,
      count: SEED_PRODUCTS.length,
      data: SEED_PRODUCTS,
      fallback: true,
      error: error.message,
    });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    let product = await Product.findOne({ id });
    if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    if (!product) {
      // Fallback search in seed products
      const fallbackItem = SEED_PRODUCTS.find((p) => p.id === id);
      if (fallbackItem) {
        return res.status(200).json({ success: true, data: fallbackItem });
      }
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (!data.name || !data.price || !data.category || !data.frontImage) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, category, and front image are required.',
      });
    }

    let productId = data.id ? slugify(data.id) : slugify(data.name);

    // Ensure unique ID
    const exists = await Product.findOne({ id: productId });
    if (exists) {
      productId = `${productId}-${Date.now().toString().slice(-4)}`;
    }

    const newProduct = await Product.create({
      ...data,
      id: productId,
      price: Number(data.price),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : Number(data.price) * 1.3,
      stock: data.stock !== undefined ? Number(data.stock) : 50,
      inStock: data.stock !== undefined ? Number(data.stock) > 0 : true,
      sizes: Array.isArray(data.sizes) ? data.sizes : ['S', 'M', 'L', 'XL'],
      isBestseller: Boolean(data.isBestseller),
      isNew: Boolean(data.isNew),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.stock !== undefined) {
      updateData.stock = Number(updateData.stock);
      updateData.inStock = updateData.stock > 0;
    }

    let product = await Product.findOneAndUpdate(
      { $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }] },
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndDelete({
      $or: [{ id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Seed catalog with default products
// @route   POST /api/products/seed
// @access  Admin
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(SEED_PRODUCTS);

    res.status(200).json({
      success: true,
      message: `Successfully seeded ${inserted.length} Flint Sector products into MongoDB!`,
      count: inserted.length,
    });
  } catch (error) {
    console.error('Error seeding products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};
