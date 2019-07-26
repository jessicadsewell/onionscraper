
function getSaved() {
    $.getJSON("/saved", function (data) {
        if (data.length > 0) {

            for (var i = 0; i < data.length; i++) {
                // Display the apropos information on the page
                // Display the information on the page
                var space = $("<br>")
                var card = $("<div>").addClass("card text-white bg-dark");
                var viewBtn = $("<button>").addClass("btn btn-secondary btn-sm view").text("View Notes").attr("data-id", data[i]._id);
                var deleteButton = $("<button>").addClass("btn btn-secondary btn-sm").text("Delete Article").attr("data-id", data[i]._id).attr("id", "deletearticle");
                var noteButton = $("<button>").addClass("btn btn-secondary btn-sm").text("Article Notes").attr("data-id", data[i]._id).attr("id", "note-btn");
                var cardHead = $("<div>").addClass("card-header");
                var cardBody = $("<div>").addClass("card-body");
                var title = $("<h4>").addClass("card-title").text(data[i].title);
                // var summary = $("<p>").addClass("card-text").text("Summary to go right here");
                var link = $("<a>").addClass("text-light").attr("href", data[i].link).text("View Article").attr("target", "_blank");

                $(cardBody).prepend(link);
                // $(cardBody).prepend(summary);
                $(cardBody).prepend(title);
                $(card).prepend(cardBody);
                $(cardHead).prepend(deleteButton);
                $(cardHead).prepend(noteButton);
                $(card).prepend(cardHead);
                $("#articles").append(card);
                $("#articles").append(space);

            }
            $("#deletearticle").on("click", function () {
                $.ajax({
                    method: "PUT",
                    url: "/unsave/" + $(this).attr("data-id")
                })
                    .then(function (data) {
                        console.log("Unsaved article");
                    })

                document.location.reload()

            });

            $("#note-btn").on("click", function () {
                $("#note-modal").modal("toggle");
                $("#save-note").attr("data-id", $(this).attr("data-id"));

            });

            $("#save-comment").on("click", function () {
                $.ajax({
                    method: "POST",
                    url: "/article/" + $(this).attr("data-id"),
                    data: JSON.stringify({
                        title: $("#note-title").val().trim(),
                        body: $("#note-body").val().trim()
                    }),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json"
                })
                    .then(function (data) {
                        console.log("Note posted");
                        $("#note-modal").modal("toggle");
                        $("#note-title").val("");
                        $("#note-body").val("");
                    })

            });

            // associate these with the articles using the data-id somehow
            $(".view").on("click", function () {

                $("#view-notes").modal("toggle");

                $.getJSON("/articles/" + $(this).attr("data-id"), function (data) {

                    if (!data.note.length == []) {

                        for (var i = 0; i < data.note.length; i++) {

                            var title = $("<h4>").text(`Title: ${data.note[i].title}`);
                            var body = $("<p>").text(`Note: ${data.note[i].body}`);
                            var linebreak = $("<br>");
                            var divider = $("<hr>");

                            $("#append-notes-here").append(title);
                            $("#append-notes-here").append(body);
                            $("#append-notes-here").append(divider);
                            $("#append-notes-here").append(linebreak);
                        }

                    } else {

                        var none = $("<h5>").text("This article has no notes saved.");
                        $("#append-notes-here").append(none);

                    }
                });
            });

        } else {
            var message = $("<h1>").text("You have no saved articles.");
            $("#append-saved").append(message);
        }
    }); 
}
getSaved();