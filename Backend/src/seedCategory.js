const mongoose = require("mongoose");
const Category = require("./models/ServiceCategory");

mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await Category.deleteMany();

  await Category.insertMany([
    { name: "Cleaning", slug: "cleaning", icon: "Sparkles" },
    { name: "Plumbing", slug: "plumbing", icon: "Wrench" },
    { name: "Electrical", slug: "electrical", icon: "Zap" },
    { name: "Painting", slug: "painting", icon: "Paintbrush" },
    { name: "Carpentry", slug: "carpentry", icon: "Hammer" },
    { name: "Moving", slug: "moving", icon: "Truck" },
    { name: "HVAC", slug: "hvac", icon: "Fan" },
    { name: "Gardening", slug: "gardening", icon: "Leaf" },
  ]);

  console.log("Categories added!");
  process.exit();
}

seed();