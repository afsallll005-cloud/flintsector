const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
    },
    categoryName: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: String,
      default: '',
    },
    frontImage: {
      type: String,
      required: [true, 'Front image URL is required'],
    },
    backImage: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    badge: {
      type: String,
      default: '',
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    gsm: {
      type: String,
      default: '240 GSM',
    },
    fabric: {
      type: String,
      default: '100% Combed Cotton',
    },
    fit: {
      type: String,
      default: 'Box-Fit Oversized',
    },
    description: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      default: 50,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
