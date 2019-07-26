
// Grab the articles as a json
function getArticles() {
  $.getJSON("/articles", function (data) {

    if (data.length > 0) {

      for (var i = 0; i < data.length; i++) {
        // Display the apropos information on the page
        // Display the information on the page
        var space = $("<br>")
        var card = $("<div>").addClass("card text-white bg-dark");
        var saveButton = $("<button>").addClass("btn btn-secondary btn-sm").text("Save Article").attr("data-id", data[i]._id).attr("id", "save-btn");

        if (data[i].saved === true) {
          $(saveButton).text("Saved")
        }
        var cardHead = $("<div>").addClass("card-header");
        var cardBody = $("<div>").addClass("card-body");
        var title = $("<h4>").addClass("card-title").text(data[i].title);
        // var summary = $("<p>").addClass("card-text").text("Summary to go right here");
        var link = $("<a>").addClass("text-light").attr("href", data[i].link).text("View Article").attr("target", "_blank");

        $(cardBody).prepend(link);
        // $(cardBody).prepend(summary);
        $(cardBody).prepend(title);
        $(card).prepend(cardBody);
        $(cardHead).prepend(saveButton);
        $(card).prepend(cardHead);
        $("#articles").append(card);
        $("#articles").append(space);
      }
      $("#save-btn").on("click", function () {
        $.ajax({
          method: "PUT",
          url: "/save/" + $(this).attr("data-id")
        })
          .then(function (data) {
            console.log("Saved article");
          })

        document.location.reload();

      })
    } else {
      var message = $("<h1>").addClass("no-articles").text("You haven't scraped any articles yet.")
      $("#articles").append(message);
    }
  });
};
    getArticles();

    $("#scrape").on("click", function () {
      $(".no-articles").remove();
      $(".cleared").remove();
      $.ajax({
        method: "GET",
        url: "/scrape",
      }).then(function (data) {
        getArticles();
        $("#success-modal").modal("toggle");
        var successMessage = $("<h5>").text(`You scraped ${data.length} articles.`);
        $("#success").append(successMessage);
      })
    });
    
    $(document).on("click", "#clearbtn", function (event) {
      $("#articles").empty();
      var cleared = $("<h4>").addClass("cleared").text("Articles have been cleared. To see more, click on Scrape Articles!");
      $("#articles").append(cleared);
    });
    

    $(document).on("click", "#home", function (event) {
      $("#articles").empty();
      getArticles();
    })