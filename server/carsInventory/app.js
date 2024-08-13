/* jshint esversion: 8 */

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3050;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Load the car_records.json from the data folder
const dataPath = path.join(__dirname, 'data', 'car_records.json');
let carsData;

try {
  carsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch (error) {
  console.error('Error reading car_records.json:', error);
  carsData = { cars: [] }; // Default to an empty array if reading fails
}

// Connect to MongoDB
mongoose.connect('mongodb://mongo_db:27017/', { dbName: 'dealershipsDB' })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import the Cars model
const Cars = require('./inventory');

async function initializeDatabase() {
  try {
    await Cars.deleteMany({});
    await Cars.insertMany(carsData);
    console.log('Database initialized with car data');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize the database
initializeDatabase();

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Mongoose API');
});

app.get('/cars/:id', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by dealer ID' });
  }
});

app.get('/carsbymake/:id/:make', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, make: req.params.make });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by make and dealer ID' });
  }
});

app.get('/carsbymodel/:id/:model', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, model: req.params.model });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by model and dealer ID' });
  }
});

app.get('/carsbymaxmileage/:id/:mileage', async (req, res) => {
  try {
    const mileage = parseInt(req.params.mileage);
    let condition = {};
    if (mileage === 50000) {
      condition = { $lte: mileage };
    } else if (mileage === 100000) {
      condition = { $lte: mileage, $gt: 50000 };
    } else if (mileage === 150000) {
      condition = { $lte: mileage, $gt: 100000 };
    } else if (mileage === 200000) {
      condition = { $lte: mileage, $gt: 150000 };
    } else {
      condition = { $gt: 200000 };
    }
    const documents = await Cars.find({ dealer_id: req.params.id, mileage: condition });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by mileage and dealer ID' });
  }
});

app.get('/carsbyprice/:id/:price', async (req, res) => {
  try {
    const price = parseInt(req.params.price);
    let condition = {};
    if (price === 20000) {
      condition = { $lte: price };
    } else if (price === 40000) {
      condition = { $lte: price, $gt: 20000 };
    } else if (price === 60000) {
      condition = { $lte: price, $gt: 40000 };
    } else if (price === 80000) {
      condition = { $lte: price, $gt: 60000 };
    } else {
      condition = { $gt: 80000 };
    }
    const documents = await Cars.find({ dealer_id: req.params.id, price: condition });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by price and dealer ID' });
  }
});

app.get('/carsbyyear/:id/:year', async (req, res) => {
  try {
    const documents = await Cars.find({ dealer_id: req.params.id, year: { $gte: parseInt(req.params.year) } });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars by year and dealer ID' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
