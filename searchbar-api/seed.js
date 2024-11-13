// // seed.js
// const mongoose = require('mongoose');
// const Item = require('./models/Item');
// require('dotenv').config();

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(async () => {
//   console.log('Connected to MongoDB for seeding');

//   const items = [
//     { name: 'Apple', description: 'A red fruit' },
//     { name: 'Banana', description: 'A yellow fruit' },
//     { name: 'Laptop', description: 'A portable computer' },
//     { name: 'Chair', description: 'A piece of furniture' },
//   ];

//   await Item.insertMany(items);
//   console.log('Seed data inserted');
//   mongoose.disconnect();
// }).catch((err) => {
//   console.error('Error seeding data:', err);
// });
