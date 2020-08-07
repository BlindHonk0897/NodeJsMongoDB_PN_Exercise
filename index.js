// Configuration part
// ------------------------------------------------------------
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 3231;

// Create express app
const app = express();
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

// Set up default mongoose connection
let db_url = "mongodb://127.0.0.1/db_exercise";
mongoose.connect(db_url, { useNewUrlParser: true });
// Get the default connection
var db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//
// Let's start the exercise :
//
// During ALL the exercise the requests have to be connected with the database
//
// Context : We want to create a web application to manage a motorcyle Championship.
// ------------------------------------------------------------

// Import Models
const Rider = require("./models/rider.model");
const Motorcycle = require("./models/motorcycle.model");

// Question 1 - Create a HTTP Request to add a riders in the database :
// When we create a rider he doesn't have a score yet.
app.post("/riders/create", (req, res) => {
  let rider = new Rider({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    age: req.body.age,
    score: [],
  });
  rider.save();
  res.json(rider);
});

// Question 2 - Create a HTTP Request to fetch all the riders :
app.get("/riders/all", (req, res) => {
  Rider.find({}, (err, riders) => {
    if (err) {
      res.send(err);
    }
    res.json({ riders: riders });
  });
});

// Question 3 - Create a HTTP Request to fetch one rider :
app.get("/riders/getOne/:riderId", (req, res) => {
  Rider.findById({ _id: req.params.riderId }, (err, rider) => {
    if (err) {
      res.send(err);
    }
    res.json(rider);
  });
});

// Question 4 - Create a HTTP Request to update firstName or/and lastName of a rider :
app.put("/riders/update/:riderId", (req, res) => {
  let toUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };
  Rider.findByIdAndUpdate(
    { _id: req.params.riderId },
    toUpdate,
    { new: true },
    (err, rider) => {
      if (err) {
        res.send(err);
      }
      res.json(rider);
    }
  );
});

// Question 5 - Create a HTTP Request to ADD score of a rider :
app.put("/riders/addScore/:riderId", (req, res) => {
  Rider.findById({ _id: req.params.riderId }, (err, rider) => {
    if (err) {
      res.send(err);
    }
    rider.score.push(req.body.score);
    rider.save();
    res.json(rider);
  });
});

// Question 6 - Create a HTTP Request to delete one rider :
app.delete("/riders/delete/:riderId", (req, res) => {
  Rider.deleteOne({ _id: req.params.riderId }, (err, result) => {
    if (err) {
      res.send(err);
    }
    Rider.find({}, (err, riders) => {
      if (err) {
        res.send(err);
      }
      res.json(result);
    });
  });
});

// Question 7 - Create a HTTP Request to create motorcycles :
// For create a motorcycle you will need to create the model first.

app.post("/motorcycles/create", (req, res) => {
  Rider.findById({ _id: req.body.riderId }, (err, rider) => {
    if (err) {
      res.send(err);
    }
    if (rider) {
      let motorcycle = new Motorcycle({
        manufacturer: req.body.manufacturer,
        displacement: req.body.displacement,
        weight: req.body.weight,
        riderId: req.body.riderId,
      });
      motorcycle.save();
      res.json(motorcycle);
    } else {
      res.send("Cannot find rider.");
    }
  });
});

// Question 8 - Create a HTTP Request to fetch all the motorcycles:
app.get("/motorcycles/all", (req, res) => {
  Motorcycle.find({}, (err, motorcycles) => {
    if (err) {
      res.send(err);
    }
    res.json({ motorcycles: motorcycles });
  });
});

// Question 9 - Create a HTTP Request to fetch all the motorcycles associate to one rider:
app.get("/motorcycles/byrider/:riderId", async (req, res) => {
  Motorcycle.find({ riderId: req.params.riderId }, (err, motorcycles) => {
    if (err) {
      res.send(err);
    }
    res.json({ motorcycles: motorcycles });
  });
});

// BONUS 10 - Create a HTTP Request to to get the riders ranking
app.get("/riders/getRankings", (req, res) => {
  Rider.find({}, (err, riders) => {
    let rank = [];
    riders.forEach((rider) => {
      rank.push({
        rider: rider,
        totalScore: rider.score.reduce((a, b) => a + b, 0),
      });
    });
    res.json({
      rankings: rank.sort((first_rider, second_rider) =>
        first_rider.totalScore < second_rider.totalScore ? 1 : -1
      ),
    });
  });
});
//
// End of the exercise

//New Exercise
// Create a HTTP Request to to get a motorycle with the corresponding rider
app.get("/motorcycles/getOnewithRider/:motorcycleId", (req, res) => {
  Motorcycle.findById({ _id: req.params.motorcycleId }, (err, motorcycle) => {
    if (err) {
      res.send(err);
    }

    res.json({ motorcycles: motorcycles });
  });
});

// ------------------------------------------------------------
// listen for requests
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
