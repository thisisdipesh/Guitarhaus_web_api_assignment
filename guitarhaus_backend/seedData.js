const mongoose = require('mongoose');
const Guitar = require('./models/Guitar');
require('dotenv').config({ path: './config/config.env' });

const sampleGuitars = [
  {
    name: "Fender Stratocaster",
    brand: "Fender",
    category: "Electric",
    price: 1299.99,
    description: "The iconic electric guitar that shaped the sound of rock music. Features three single-coil pickups and a versatile 5-way switch.",
    stock: 15,
    isAvailable: true,
    isFeatured: true,
    images: ["stratocaster.jpg"],
    specifications: {
      color: "Sunburst",
      material: "Alder body, Maple neck",
      strings: "6-string"
    }
  },
  {
    name: "Gibson Les Paul Standard",
    brand: "Gibson",
    category: "Electric",
    price: 2499.99,
    description: "A legendary guitar known for its rich, warm tone and sustain. Perfect for blues, rock, and jazz.",
    stock: 8,
    isAvailable: true,
    isFeatured: true,
    images: ["lespaul.jpg"],
    specifications: {
      color: "Cherry Sunburst",
      material: "Mahogany body, Maple top",
      strings: "6-string"
    }
  },
  {
    name: "Martin D-28",
    brand: "Martin",
    category: "Acoustic",
    price: 3299.99,
    description: "The classic dreadnought acoustic guitar with exceptional projection and balanced tone.",
    stock: 12,
    isAvailable: true,
    isFeatured: true,
    images: ["martin-d28.jpg"],
    specifications: {
      color: "Natural",
      material: "Solid Sitka Spruce top, Rosewood back and sides",
      strings: "6-string"
    }
  },
  {
    name: "Taylor 214ce",
    brand: "Taylor",
    category: "Acoustic",
    price: 899.99,
    description: "A versatile acoustic-electric guitar with Taylor's signature bright, clear tone.",
    stock: 20,
    isAvailable: true,
    isFeatured: false,
    images: ["taylor-214ce.jpg"],
    specifications: {
      color: "Natural",
      material: "Solid Sitka Spruce top, Layered Rosewood back and sides",
      strings: "6-string"
    }
  },
  {
    name: "PRS Custom 24",
    brand: "PRS",
    category: "Electric",
    price: 3499.99,
    description: "A premium electric guitar with 24 frets and versatile humbucker pickups.",
    stock: 6,
    isAvailable: true,
    isFeatured: true,
    images: ["prs-custom24.jpg"],
    specifications: {
      color: "Tiger Eye",
      material: "Mahogany body, Maple top",
      strings: "6-string"
    }
  },
  {
    name: "Yamaha FG800",
    brand: "Yamaha",
    category: "Acoustic",
    price: 199.99,
    description: "An excellent beginner acoustic guitar with great sound quality and affordability.",
    stock: 25,
    isAvailable: true,
    isFeatured: false,
    images: ["yamaha-fg800.jpg"],
    specifications: {
      color: "Natural",
      material: "Solid Spruce top, Nato back and sides",
      strings: "6-string"
    }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.LOCAL_DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing guitars
    await Guitar.deleteMany({});
    console.log('Cleared existing guitars');

    // Insert sample guitars
    const insertedGuitars = await Guitar.insertMany(sampleGuitars);
    console.log(`Inserted ${insertedGuitars.length} sample guitars`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 