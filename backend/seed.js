import "dotenv/config";
import connectDB from "./config/db.js";
import Category from "./models/Category.js";
import Material from "./models/Material.js";

async function seed() {
  await connectDB();

  const category = await Category.create({
    name: "Electronics",
    status: "ACTIVE",
  });
  const material = await Material.create({
    category_id: category._id,
    name: "Smartphone",
    status: "ACTIVE",
  });

  console.log("Category ID:", category._id.toString());
  console.log("Material ID:", material._id.toString());

  process.exit(0);
}

seed();
