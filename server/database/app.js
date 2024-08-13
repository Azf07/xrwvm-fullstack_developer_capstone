var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var cors = require('cors');
var app = express();
var port = 3030;

app.use(cors());
app.use(require('body-parser').urlencoded({ extended: false }));

var reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
var dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' });

var Reviews = require('./review');
var Dealerships = require('./dealership');

try {
  Reviews.deleteMany({}).then(function() {
    Reviews.insertMany(reviews_data.reviews);
  });
  Dealerships.deleteMany({}).then(function() {
    Dealerships.insertMany(dealerships_data.dealerships);
  });
} catch (error) {
  console.error('Error inserting documents:', error);
}

// Express route to home
app.get('/', async function(req, res) {
  res.send("Welcome to the Mongoose API");
});

// Express route to fetch all reviews
app.get('/fetchReviews', async function(req, res) {
  try {
    var documents = await Reviews.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch reviews by a particular dealer
app.get('/fetchReviews/dealer/:id', async function(req, res) {
  try {
    var documents = await Reviews.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching documents' });
  }
});

// Express route to fetch all dealerships
app.get('/fetchDealers', async function(req, res) {
  try {
    var dealers = await Dealerships.find();
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Express route to fetch Dealers by a particular state
app.get('/fetchDealers/:state', async function(req, res) {
  try {
    var dealers = await Dealerships.find({ state: req.params.state });
    res.json(dealers);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealerships' });
  }
});

// Express route to fetch dealer by a particular id
app.get('/fetchDealer/:id', async function(req, res) {
  try {
    var dealer = await Dealerships.findOne({ id: req.params.id });
    if (dealer) {
      res.json(dealer);
    } else {
      res.status(404).json({ error: 'Dealer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dealer' });
  }
});

// Express route to insert review
app.post('/insert_review', express.raw({ type: '*/*' }), async function(req, res) {
  var data = JSON.parse(req.body);
  var documents = await Reviews.find().sort({ id: -1 });
  var new_id = documents[0].id + 1;

  var review = new Reviews({
    "id": new_id,
    "name": data.name,
    "dealership": data.dealership,
    "review": data.review,
    "purchase": data.purchase,
    "purchase_date": data.purchase_date,
    "car_make": data.car_make,
    "car_model": data.car_model,
    "car_year": data.car_year,
  });

  try {
    var savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error inserting review' });
  }
});

// Start the Express server
app.listen(port, function() {
  console.log("Server is running on http://localhost:" + port);
});
