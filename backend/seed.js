require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const HeritageSite = require('./models/HeritageSite');
const User = require('./models/User');

const sites = [
    {
        name: 'Brihadisvara Temple',
        location: 'THANJAVUR',
        detail: 'Thanjavur',
        description: 'UNESCO World Heritage Site',
        imageKey: 'brihadeeswarar',
    },
    {
        name: 'Meenakshi Amman',
        location: 'MADURAI',
        detail: 'Madurai',
        description: 'Iconic Dravidian Architecture',
        imageKey: 'meenakshi',
    },
    {
        name: 'Shore Temple',
        location: 'MAHABALIPURAM',
        detail: 'Mahabalipuram',
        description: 'Shorefront Rock-cut Temple',
        imageKey: 'shore',
    },
];

async function seed() {
    await connectDB();

    // Seed heritage sites
    await HeritageSite.deleteMany({});
    await HeritageSite.insertMany(sites);
    console.log('Heritage sites seeded.');

    // Seed admin user
    const adminEmail = 'bernesh.in@gmail.com';
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
        await User.create({
            name: 'Admin',
            email: adminEmail,
            password: 'Heritage@2024!',
            isAdmin: true,
        });
        console.log('Admin user created.');
    } else {
        console.log('Admin user already exists.');
    }

    mongoose.disconnect();
    console.log('Seeding complete.');
}

seed().catch(err => { console.error(err); process.exit(1); });
