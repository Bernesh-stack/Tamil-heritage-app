require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const HeritageSite = require('./models/HeritageSite');
const User = require('./models/User');

const sites = [
    {
        name: "Brihadisvara Temple",
        location: "THANJAVUR, TAMIL NADU",
        detail: "Thanjavur",
        overview: "A monumental achievement of Chola architecture.",
        history: "Built by Raja Raja Chola I in 1010 AD, this UNESCO World Heritage site is famous for its 216-foot tall tower (Vimana).",
        significance: "Features the massive monolithic Nandi statue and remains one of the largest temples in India.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Brihadisvara+Temple+Thanjavur",
        imageKey: "brihadeeswarar",
        category: "Temple",
        builtBy: "Raja Raja Chola I",
        year: "1010 AD",
        latitude: 10.7828,
        longitude: 79.1318
    },
    {
        name: "Meenakshi Amman Temple",
        location: "MADURAI, TAMIL NADU",
        detail: "Madurai",
        overview: "The spiritual heart of Madurai with its towering gopurams.",
        history: "Dedicated to Goddess Meenakshi and Lord Sundareswarar, this temple is a masterpiece of Dravidian architecture.",
        significance: "Features 14 magnificent gopurams, including the famous Southern Tower which is nearly 170 feet high.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Meenakshi+Amman+Temple+Madurai",
        imageKey: "meenakshi",
        category: "Temple",
        builtBy: "Pandya Dynasty",
        year: "1600 AD",
        latitude: 9.9195,
        longitude: 78.1193
    },
    {
        name: "Shore Temple",
        location: "MAHABALIPURAM, TAMIL NADU",
        detail: "Mahabalipuram",
        overview: "A stunning rock-cut temple overlooking the Bay of Bengal.",
        history: "Constructed at Mahabalipuram in the 8th century AD, it is one of the oldest structural stone temples in South India.",
        significance: "Part of the Group of Monuments at Mahabalipuram, a UNESCO World Heritage Site.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shore+Temple+Mahabalipuram",
        imageKey: "shore",
        category: "Monument",
        builtBy: "Narasimhavarman II (Pallava Dynasty)",
        year: "700 AD",
        latitude: 12.6160,
        longitude: 80.1927
    },
    {
        name: "Gangaikonda Cholapuram",
        location: "ARIYALUR, TAMIL NADU",
        detail: "Ariyalur",
        overview: "The capital of the Cholas after Thanjavur.",
        history: "Built by Rajendra Chola I to commemorate his victory over the Pala Dynasty of Bengal.",
        significance: "Known for its feminine counterpart to the Brihadisvara temple's masculine tower.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Gangaikonda+Cholapuram",
        imageKey: "gangaikonda",
        category: "Temple",
        builtBy: "Rajendra Chola I",
        year: "1035 AD",
        latitude: 11.2014,
        longitude: 79.4447
    },
    {
        name: "Airavatesvara Temple",
        location: "DARASURAM, TAMIL NADU",
        detail: "Darasuram",
        overview: "A exquisite Great Living Chola Temple.",
        history: "A UNESCO World Heritage Site, noted for its intricate stone carvings and Chariot-shaped architecture.",
        significance: "Smaller than Thanjavur but more detailed in its artistic execution.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Airavatesvara+Temple+Darasuram",
        imageKey: "airavatesvara",
        category: "Temple",
        builtBy: "Rajaraja Chola II",
        year: "12th Century AD",
        latitude: 10.9490,
        longitude: 79.3562
    },
    {
        name: "Srirangam Ranganathaswamy",
        location: "TRICHY, TAMIL NADU",
        detail: "Trichy",
        overview: "The world's largest functioning Hindu temple complex.",
        history: "Spread over 156 acres, this temple dedicated to Vishnu is a spiritual fortress with 21 gopurams.",
        significance: "One of the most prominent 108 Divya Desams with 7 concentric enclosures.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Srirangam+Ranganathaswamy+Temple+Trichy",
        imageKey: "srirangam",
        category: "Temple",
        builtBy: "Various Dynasties",
        year: "6th - 16th Century AD",
        latitude: 10.8624,
        longitude: 78.6876
    },
    {
        name: "Kapaleeshwarar Temple",
        location: "MYLAPORE, CHENNAI",
        detail: "Chennai",
        overview: "A cultural icon in the heart of Chennai.",
        history: "A temple of Lord Shiva located in Mylapore. Current gopuram built by Vijayanagara kings in the 16th century.",
        significance: "A masterpiece of Dravidian architecture known for its vibrant gopuram and tank.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kapaleeshwarar+Temple+Chennai",
        imageKey: "kapaleeshwarar",
        category: "Temple",
        builtBy: "Vijayanagara Empire",
        year: "16th Century AD",
        latitude: 13.0336,
        longitude: 80.2694
    },
    {
        name: "Ramanathaswamy Temple",
        location: "RAMESWARAM, TAMIL NADU",
        detail: "Rameswaram",
        overview: "Famous for having the longest temple corridor in the world.",
        history: "Located on Rameswaram island, its corridors are nearly 1220 meters long featuring intricately carved pillars.",
        significance: "One of the twelve Jyotirlinga shrines and a key site in the Ramayana.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Ramanathaswamy+Temple+Rameswaram",
        imageKey: "ramanathaswamy",
        category: "Temple",
        builtBy: "Pandya and Jaffna Kings",
        year: "12th Century AD",
        latitude: 9.2881,
        longitude: 79.3174
    },
    {
        name: "Vivekananda Rock Memorial",
        location: "KANYAKUMARI, TAMIL NADU",
        detail: "Kanyakumari",
        overview: "A monument where the three seas meet.",
        history: "Built in 1970 in honour of Swami Vivekananda who meditated on this rock.",
        significance: "Stands at the confluence of the Indian Ocean, Bay of Bengal, and Arabian Sea.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Vivekananda+Rock+Memorial",
        imageKey: "vivekananda",
        category: "Monument",
        builtBy: "Vivekananda Rock Memorial Committee",
        year: "1970 AD",
        latitude: 8.0772,
        longitude: 77.5552
    },
    {
        name: "Thirumalai Nayakkar Mahal",
        location: "MADURAI, TAMIL NADU",
        detail: "Madurai",
        overview: "A classic fusion of Dravidian and Islamic styles.",
        history: "A 17th-century palace built by King Thirumalai Nayak in 1636 AD.",
        significance: "Famous for its giant circular pillars and the grand courtyard.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Thirumalai+Nayakkar+Mahal",
        imageKey: "nayakkar",
        category: "Cultural Site",
        builtBy: "Thirumalai Nayak",
        year: "1636 AD",
        latitude: 9.9142,
        longitude: 78.1232
    },
    {
        name: "Gingee Fort",
        location: "VILLUPURAM, TAMIL NADU",
        detail: "Villupuram",
        overview: "The 'Troy of the East' - an impregnable fortress.",
        history: "One of the surviving forts in Tamil Nadu, spread across three hillocks.",
        significance: "Strategic location and strength hailed by the British as the Troy of the East.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Gingee+Fort",
        imageKey: "gingee",
        category: "Monument",
        builtBy: "Chola and Nayaka Dynasties",
        year: "9th - 16th Century AD",
        latitude: 12.2530,
        longitude: 79.4057
    },
    {
        name: "Chidambaram Natarajar",
        location: "CHIDAMBARAM, TAMIL NADU",
        detail: "Chidambaram",
        overview: "The temple of the Cosmic Dancer.",
        history: "Representing the element of ether (Akasha). Gold-plated roof and depiction of 108 Karanas.",
        significance: "One of the Pancha Bootha Sthalams dedicated to Lord Shiva as Nataraja.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Chidambaram+Natarajar+Temple",
        imageKey: "chidambaram",
        category: "Temple",
        builtBy: "Pallava and Chola Kings",
        year: "10th Century AD",
        latitude: 11.3994,
        longitude: 79.6934
    },
    {
        name: "Nagercoil Nagaraja Temple",
        location: "NAGERCOIL, TAMIL NADU",
        detail: "Nagercoil",
        overview: "A unique temple dedicated to the Serpent King.",
        history: "Famous for its Janardhana and Nagaraja shrines. The region is named after this deity.",
        significance: "Unique architecture with distinct features dedicated to Nagaraja.",
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Nagaraja+Temple+Nagercoil",
        imageKey: "nagaraja",
        category: "Temple",
        builtBy: "Traditional",
        year: "Ancient",
        latitude: 8.1887,
        longitude: 77.4285
    }
];

async function seed() {
    try {
        await connectDB();
        await HeritageSite.deleteMany({});
        await HeritageSite.insertMany(sites);
        console.log(`${sites.length} heritage sites seeded successfully.`);
        const adminEmail = 'bernesh.in@gmail.com';
        const existing = await User.findOne({ email: adminEmail });
        if (!existing) {
            await User.create({ name: 'Admin', email: adminEmail, password: 'Heritage@2024!', isAdmin: true });
        }
        console.log('Seeding complete.');
        mongoose.disconnect();
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();
