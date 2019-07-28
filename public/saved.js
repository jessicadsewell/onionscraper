
function getSaved() {
    $.getJSON("/saved", function (data) {
        if (data.length > 0) {

            for (var i = 0; i < data.length; i++) {
                var space = $("<br>")
                var card = $("<div>").addClass("card text-white bg-dark");
                var viewBtn = $("<button>").addClass("btn btn-secondary btn-sm view").text("View Notes").attr("data-id", data[i]._id);
                var deleteButton = $("<button>").addClass("btn btn-secondary btn-sm delete").text("Delete Article").attr("data-id", data[i]._id);
                var noteButton = $("<button>").addClass("btn btn-secondary btn-sm note").text("Create Article Note").attr("data-id", data[i]._id);
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
                $(cardHead).prepend(viewBtn);
                $(card).prepend(cardHead);
                $("#articles").append(card);
                $("#articles").append(space);

            }
            $(".delete").on("click", function () {
                $.ajax({
                    method: "PUT",
                    url: "/unsave/" + $(this).attr("data-id")
                })
                    .then(function (data) {
                        console.log("Unsaved article");
                    })

                document.location.reload()

            });

            $(".note").on("click", function () {
                $("#note-modal").modal("toggle");
                $("#save-note").attr("data-id", $(this).attr("data-id"));

            });

            $("#save-note").on("click", function () {
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
                $("#append-notes-here").empty();

                $("#view-notes").modal("toggle");

                var ID = $(this).attr("data-id");

                $.getJSON("/article/" + ID, function (data) {
                    console.log("data : " + data)

                    if (!data.note.length == []) {

                        for (var i = 0; i < data.note.length; i++) {
                            var noteDiv = $("<div>").attr("id", data.note[i]._id);
                            var removeBtn = $("<button>").addClass("btn btn-danger btn-sm remove-note").attr("data-id", data.note[i]._id).text("X");
                            var title = $("<h4>").text(`Title: ${data.note[i].title}`);
                            var body = $("<p>").text(`Note: ${data.note[i].body}`);
                            var linebreak = $("<br>");
                            var divider = $("<hr>");

                            $("#append-notes-here").append(noteDiv);
                            $(noteDiv).append(title);
                            $(title).append(removeBtn);
                            $(noteDiv).append(body);
                            $(noteDiv).append(divider);
                            $(noteDiv).append(linebreak);
                        }
                        $(".remove-note").on("click", function() {
                        
                            $.ajax({
                                method: "DELETE",
                                url: "/delete/" + $(this).attr("data-id")
                            })
                            .then(function(data) {
                                console.log("Deleted note");
                            })

                            $(`[id=${$(this).attr('data-id')}]`).remove();
                            
                        });

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