const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@store.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
  },
];

const products = [
  { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling headphones with 30hr battery life and deep bass.', price: 2999, category: 'Electronics', stock: 50, featured: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { name: 'Smart Watch Pro', description: 'Feature-rich smartwatch with health monitoring, GPS, and 7-day battery.', price: 7999, category: 'Electronics', stock: 30, featured: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { name: 'Running Shoes X500', description: 'Lightweight and breathable running shoes with advanced cushioning technology.', price: 1599, category: 'Sports', stock: 80, featured: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { name: 'The Art of Clean Code', description: 'A practical guide to writing readable, maintainable, and efficient code.', price: 499, category: 'Books', stock: 100, featured: false, image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400' },
  { name: 'Casual Cotton T-Shirt', description: '100% organic cotton, breathable, available in multiple colors.', price: 299, category: 'Clothing', stock: 200, featured: false, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400' },
  { name: 'Coffee Maker Deluxe', description: 'Brew barista-quality coffee at home with programmable settings and built-in grinder.', price: 3499, category: 'Home & Garden', stock: 25, featured: true, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400' },
  { name: 'Yoga Mat Premium', description: 'Eco-friendly non-slip yoga mat with alignment guides, 6mm thick.', price: 899, category: 'Sports', stock: 60, featured: false, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400' },
  { name: 'Mechanical Keyboard TKL', description: 'Tenkeyless mechanical keyboard with RGB backlight and tactile switches.', price: 4299, category: 'Electronics', stock: 40, featured: true, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400' },
  { name: 'Denim Jacket Classic', description: 'Timeless denim jacket with a modern slim fit and reinforced stitching.', price: 1299, category: 'Clothing', stock: 45, featured: false, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400' },
  { name: 'LEGO Architecture Set', description: 'Build iconic world landmarks. 1,500+ pieces, suitable for ages 12+.', price: 2199, category: 'Toys', stock: 35, featured: false, image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400' },
  { name: 'Organic Green Tea (250g)', description: 'Hand-picked premium organic green tea from Darjeeling hills.', price: 349, category: 'Food', stock: 150, featured: false, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { name: 'Portable Power Bank 20000mAh', description: 'Fast-charge power bank with USB-C PD 65W and dual USB-A ports.', price: 1999, category: 'Electronics', stock: 70, featured: true, image: 'https://images.unsplash.com/photo-1609592806596-bbf6d3c3f37b?w=400' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Seed users (password hashing is handled by pre-save hook)
    const createdUsers = await User.create(users);
    console.log(`Created ${createdUsers.length} users`);

    // Seed products
    const createdProducts = await Product.create(products);
    console.log(`Created ${createdProducts.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Login:  admin@store.com / admin123');
    console.log('User Login:   john@example.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();