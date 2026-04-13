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
        description: "A monumental achievement of Chola architecture.",
        fullDescription: "Built by Raja Raja Chola I in 1010 AD, this UNESCO World Heritage site is famous for its 216-foot tall tower (Vimana) and the massive monolithic Nandi statue. It remains one of the largest temples in India.",
        imageKey: "brihadeeswarar",
        category: "Temple",
        builtBy: "Raja Raja Chola I",
        year: "1010 AD"
    },
    {
        name: "Meenakshi Amman Temple",
        location: "MADURAI, TAMIL NADU",
        detail: "Madurai",
        description: "The spiritual heart of Madurai with its towering gopurams.",
        fullDescription: "Dedicated to Goddess Meenakshi and Lord Sundareswarar, this temple is a masterpiece of Dravidian architecture. It features 14 magnificent gopurams, including the famous Southern Tower which is nearly 170 feet high.",
        imageKey: "meenakshi",
        category: "Temple",
        builtBy: "Pandya Dynasty",
        year: "1600 AD"
    },
    {
        name: "Shore Temple",
        location: "MAHABALIPURAM, TAMIL NADU",
        detail: "Mahabalipuram",
        description: "A stunning rock-cut temple overlooking the Bay of Bengal.",
        fullDescription: "Constructed at Mahabalipuram in the 8th century AD, it is one of the oldest structural stone temples in South India. It is part of the Group of Monuments at Mahabalipuram, a UNESCO World Heritage Site.",
        imageKey: "shore",
        category: "Monument",
        builtBy: "Narasimhavarman II (Pallava Dynasty)",
        year: "700 AD"
    },
    {
        name: "Gangaikonda Cholapuram",
        location: "ARIYALUR, TAMIL NADU",
        detail: "Ariyalur",
        description: "The capital of the Cholas after Thanjavur.",
        fullDescription: "Built by Rajendra Chola I to commemorate his victory over the Pala Dynasty of Bengal. The temple is known for its feminine counterpart to the Brihadisvara temple's masculine tower.",
        imageKey: "gangaikonda",
        category: "Temple",
        builtBy: "Rajendra Chola I",
        year: "1035 AD"
    },
    {
        name: "Airavatesvara Temple",
        location: "DARASURAM, TAMIL NADU",
        detail: "Darasuram",
        description: "A exquisite Great Living Chola Temple.",
        fullDescription: "This temple is a UNESCO World Heritage Site, noted for its intricate stone carvings and Chariot-shaped architecture. It is smaller than Thanjavur but more detailed in its artistic execution.",
        imageKey: "airavatesvara",
        category: "Temple",
        builtBy: "Rajaraja Chola II",
        year: "12th Century AD"
    },
    {
        name: "Srirangam Ranganathaswamy",
        location: "TRICHY, TAMIL NADU",
        detail: "Trichy",
        description: "The world's largest functioning Hindu temple complex.",
        fullDescription: "Spread over 156 acres, this temple dedicated to Vishnu is a spiritual fortress with 21 gopurams and 7 concentric enclosures. It is one of the most prominent 108 Divya Desams.",
        imageKey: "srirangam",
        category: "Temple",
        builtBy: "Various Dynasties",
        year: "6th - 16th Century AD"
    },
    {
        name: "Kapaleeshwarar Temple",
        location: "MYLAPORE, CHENNAI",
        detail: "Chennai",
        description: "A cultural icon in the heart of Chennai.",
        fullDescription: "A temple of Lord Shiva located in Mylapore. The current gopuram was built by the Vijayanagara kings in the 16th century, though the original temple was far older.",
        imageKey: "kapaleeshwarar",
        category: "Temple",
        builtBy: "Vijayanagara Empire",
        year: "16th Century AD"
    },
    {
        name: "Ramanathaswamy Temple",
        location: "RAMESWARAM, TAMIL NADU",
        detail: "Rameswaram",
        description: "Famous for having the longest temple corridor in the world.",
        fullDescription: "Located on Rameswaram island, its corridors are nearly 1220 meters long and feature intricately carved pillars. It is one of the twelve Jyotirlinga shrines.",
        imageKey: "ramanathaswamy",
        category: "Temple",
        builtBy: "Pandya and Jaffna Kings",
        year: "12th Century AD"
    },
    {
        name: "Vivekananda Rock Memorial",
        location: "KANYAKUMARI, TAMIL NADU",
        detail: "Kanyakumari",
        description: "A monument where the three seas meet.",
        fullDescription: "Built in 1970 in honour of Swami Vivekananda. It stands on one of two rocks located about 500 meters offshore, overlooking the confluence of the Indian Ocean, Bay of Bengal, and Arabian Sea.",
        imageKey: "vivekananda",
        category: "Monument",
        builtBy: "Vivekananda Rock Memorial Committee",
        year: "1970 AD"
    },
    {
        name: "Thirumalai Nayakkar Mahal",
        location: "MADURAI, TAMIL NADU",
        detail: "Madurai",
        description: "A classic fusion of Dravidian and Islamic styles.",
        fullDescription: "A 17th-century palace built by King Thirumalai Nayak. The palace is famous for its giant circular pillars and the courtyard which is a venue for sound and light shows.",
        imageKey: "nayakkar",
        category: "Cultural Site",
        builtBy: "Thirumalai Nayak",
        year: "1636 AD"
    },
    {
        name: "Gingee Fort",
        location: "VILLUPURAM, TAMIL NADU",
        detail: "Villupuram",
        description: "The 'Troy of the East' - an impregnable fortress.",
        fullDescription: "One of the surviving forts in Tamil Nadu, it is spread across three hillocks. It was called the 'Troy of the East' by the British for its strategic location and strength.",
        imageKey: "gingee",
        category: "Monument",
        builtBy: "Chola and Nayaka Dynasties",
        year: "9th - 16th Century AD"
    },
    {
        name: "Chidambaram Natarajar",
        location: "CHIDAMBARAM, TAMIL NADU",
        detail: "Chidambaram",
        description: "The temple of the Cosmic Dancer.",
        fullDescription: "One of the Pancha Bootha Sthalams, representing the element of ether (Akasha). The temple is famous for its gold-plated roof and the depiction of the 108 Karanas of Bharatanatyam.",
        imageKey: "chidambaram",
        category: "Temple",
        builtBy: "Pallava and Chola Kings",
        year: "10th Century AD"
    },
    {
        name: "Nagercoil Nagaraja Temple",
        location: "NAGERCOIL, TAMIL NADU",
        detail: "Nagercoil",
        description: "A unique temple dedicated to the Serpent King.",
        fullDescription: "Famous for its Janardhana and Nagaraja shrines. The temple's architecture has distinct features and the region around it is named after the presiding deity.",
        imageKey: "nagaraja",
        category: "Temple",
        builtBy: "Traditional",
        year: "Ancient"
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
