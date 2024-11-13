
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Item = require('./modals/Item');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());  // Enable CORS


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    console.log('Connected to MongoDB for seeding');
  
    const items = [
        { name: 'apple'.toLowerCase(), description: 'A red fruit' },
        { name: 'banana'.toLowerCase(), description: 'A yellow fruit' },
        { name: 'laptop'.toLowerCase(), description: 'A portable computer' },
        { name: 'chair'.toLowerCase(), description: 'A piece of furniture' },
      ];
      
    for (const item of items) {
      const exists = await Item.findOne({ name: item.name, description: item.description });
      if (!exists) {
        await Item.create(item);
      }
    }
    console.log('Seed data inserted without duplicates');
  }).catch((err) => {
    console.error('Error seeding data:', err);
  });
  
   
  
  async function removeDuplicates() {
    const allItems = await Item.find();
    const seenNames = new Set();
  
    for (const item of allItems) {
      if (seenNames.has(item.name)) {
        await Item.deleteOne({ _id: item._id }); // Remove duplicate
        console.log(`Removed duplicate item: ${item.name}`);
      } else {
        seenNames.add(item.name);
      }
    }
  
    console.log('Duplicate removal complete');
  }
  
  // Call this function as needed
  removeDuplicates().catch(console.error);
  
// Search bar API route


app.get('/api/search', async (req, res) => {
    if (mongoose.connection.readyState !== 1) { // Check if the connection is established
      return res.status(500).json({ message: 'Database not connected' });
    }
  
    const { query } = req.query;
    console.log("Backend received query:", query);
  
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }
  
    try {
      const cleanedQuery = query.trim();
      console.log("Searching for:", cleanedQuery);
  
      // Search for items matching the query exactly or partially (case-insensitive)
      const results = await Item.find({ name: new RegExp(`^${cleanedQuery}$`, 'i') });
      console.log("Search results:", results);
  
      if (results.length === 0) {
        console.log("No items found");
        res.status(404).json({ message: 'No items found' });
      } else {
        res.json(results);
      }
    } catch (error) {
      console.error("Error occurred during search:", error);
      res.status(500).json({ message: 'Error searching', error: error.message });
    }
  });
  
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
