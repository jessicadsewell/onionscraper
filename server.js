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

app.get("/saved", function (req, res) {
    db.Article.find({ saved : true })
    .populate("note")
    .then(function (articles) {
        res.json(articles);
    })
    .catch(function(err) {
        res.json(err);
    })
})


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
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

app.post("/articles/save/:id", function (req,res) {
	Article.findOneAndUpdate( { "_id": req.params.id}, {"saved": true})
	.then(function (err, saved) {
		if(err){
			console.log(err);
		}
		else{
			res.send(saved);
		}
	});
});

app.post("/articles/delete/:id", function(req,res){
	Article.findOneAndUpdate( { "_id": req.params.id}, {"saved": false, "note":[]} )
	.then(function (err, deleted){
		if(err){
			console.log(err);
		}
		else{
			res.send(deleted);
		}
	});
});

app.post("note/save/:id", function (req,res){
	var newNote = new Note({
		body: req.body.text,
		article: req.params.id
	});
	console.log(req.body)
	newNote.save(function (error, note){
		if(error){
			console.log(error);
		}
		else{
			Article.findOneAndUpdate({ "_id": req.params.id}, {$push: { "note": note } })
			.exec(function(err){
				if(err){
					console.log(err);
					res.send(err);
				}
				else{
					res.send(note);
				}
			});
		}
	});
});

app.delete("note/delete/:note_id/:article", function(req,res){
	Note.findOneAndRemove({_id: req.params.note.id}, function(err){
		if(err){
			console.log(err);
			res.send(err);
		}
		else{
			Article.findOneAndUpdate({"_id": req.params.article_id}, {$pull: {"note": req.params.note_id}})
				.exec(function(err){
					if(err){
						console.log(err);
						res.send(err); 
					}
					else{
						res.send("Note Deleted");
					}
				});
		}
	});
});


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});

