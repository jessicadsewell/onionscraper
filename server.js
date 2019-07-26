var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));


// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.theonion.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        
        $("article").each(function (i, element) {
            
            var result = {};
            
            result.title = $(this).find("h1").text();
            result.link = $(this).find("a").attr("href");
            
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function (dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
            });
        });
        res.send("Scrape Complete");
        
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({saved: false})
        .limit(6)
        .then(function (articles) {
            res.json(articles);
        })
        .catch(function (err) {
            res.json(err);
        })
});

// Route for getting all Saved Articles from the db
app.get("/saved", function (req, res) {
    db.Article.find({ saved : true })
    // .populate("note")
    .then(function (articles) {
        res.json(articles);
    })
    .catch(function(err) {
        res.json(err);
    })
})


// Route for toggling saved value to true when the saved button is pressed
app.put("/save/:id", function(req, res){
    console.log(req.params.id);
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved : true } } )
    .then(function(updated){
        res.json(updated)
    })
    .catch(function(err) {
        res.json(err);
    })
})

// Route for toggling saved value to false when the delete button is pressed
app.put("/unsave/:id", function(req, res){
    console.log(req.params.id);
    db.Article.findOneAndDelete({ _id: req.params.id }, { $set: { saved : false } } )
    .then(function(updated){
        res.json(updated)
    })
    .catch(function(err) {
        res.json(err);
    })
})

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/article/:id", function (req, res) {
    // TODO
    // ====
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (note) {
            res.json(note);
        })
        .catch(function (err) {
            res.json(err)
        })
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
});

// Route for saving an Article's associated Comment
app.post("/article/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
    })
    .then(function(note) {
        res.json(note);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

