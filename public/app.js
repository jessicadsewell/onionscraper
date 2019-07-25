// Each article should include: 

// * Headline - the title of the article

// * Summary - a short summary of the article

// * URL - the url to the original article

// * Users will also be able to leave comments on an associated article

// * Feel free to add more content to your database (photos, bylines, and so on).

// Grab the articles as a json

$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

$("#scrape").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).then(function (data) {
    console.log(data)
    window.location = "/"
  })
});

$("#savebutton").on("click", function() {
  id = $(this).attr("data-id");
  $("#" + id).hide();
  $.ajax({
    method: "POST",
    url: "/articles/" + id,
        data: {
            saved: true
        }
  });
});
// $(".delete").on("click", function () {
//   var thisId = $(this).attr("data-id");
//   $.ajax({
//     mehtod: "POST",
//     url: "/articles/delete/" + thisId
//   }).done(function (data) {
//     window.location = "/saved"
//   })
// });

// $(".saveNote").on("click", function() {
// 	var thisId = $(this).attr("data-id");
// 	if(!$("#noteText" + thisId).val()) {
// 		alert("please enter a note to save")
// 	} else {
// 		$.ajax({
// 			method: "POST",
// 			url: "/notes.save/" + thisId,
// 			data:{
// 				text: $("#noteText" + thisId).val()
// 			}
// 		}).done(function(data){
// 			console.log(data)
// 				$("#noteText" + thisId).val("");
// 				$(".modalNote").modal("hide");
// 				window.location = "/saved"
			
// 		});
// 	}
// });

// $(".deleteNote").on("click", function() {
// 	var noteId = $(this).attr("data-note-id");
// 	var articleId = $(this).attr("data-article-id");
// 	$.ajax({
// 		method: "DELETE",
// 		url: "/notes/delete/" + noteId + "/" + articleId
// 	}).done(function(data){
// 		console.log(data)
// 		$(".modalNote").modal("hide");
// 		window.location = "/saved"
// 	})
// });


// Whenever someone clicks a p tag
$(document).on("click", "p", function () {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savebutton'>Save Article</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});


// $(document).on("click", ".scrape-new", function () {
//   $.ajax({
//     method: "GET",
//     url: "/saved" + thisId
//   })
//     .then(function (data) {
//       console.log(data);
//       // The title of the article
//       $("#articles").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#articles").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#articles").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#articles").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
//       $("#articles").append("<button data-id='" + data._id + "' id='deletesaved'>Delete From Saved</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });

  // // When you click the savearticle button
  // $(document).on("click", "#savenote", function () {
  //   // Grab the id associated with the article from the submit button
  //   var thisId = $(this).attr("data-id");

  //   // Run a POST request to change the note, using what's entered in the inputs
  //   $.ajax({
  //     method: "POST",
  //     url: "/articles/" + thisId,
  //     data: {
  //       // Value taken from title input
  //       title: $("#titleinput").val(),
  //       // Value taken from note textarea
  //       body: $("#bodyinput").val()
  //     }
  //   })
  //     // With that done
  //     .then(function (data) {
  //       // Log the response
  //       console.log(data);
  //       // Empty the notes section
  //       $("#notes").empty();
  //     });

  //   // Also, remove the values entered in the input and textarea for note entry
  //   $("#titleinput").val("");
  //   $("#bodyinput").val("");
  // });

