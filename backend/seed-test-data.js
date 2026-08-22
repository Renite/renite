import 'dotenv/config';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Material from './models/Material.js';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URL);

  let category = await Category.findOne({ name: 'Electronics' });
  if (!category) {
    category = await Category.create({ name: 'Electronics', status: 'ACTIVE' });
  }

  let material = await Material.findOne({ category_id: category._id, name: 'Smartphone' });
  if (!material) {
    material = await Material.create({ category_id: category._id, name: 'Smartphone', status: 'ACTIVE' });
  }

  console.log('CATEGORY_ID:', category._id.toString());
  console.log('MATERIAL_ID:', material._id.toString());

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
