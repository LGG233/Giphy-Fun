var searchText = ""; // text from input box that will eventually become search term on Giphy
var topics = ["Paris", "Shanghai", "London", "Sydney", "Venice", "New York", "Hong Kong", "Mexico City", "Tokyo", "New Delhi"];
var gifSearch = ""; // name of searchText used in query URL and to push to DOM

renderButtons();
getGIFs();

$(document).ready(function () { // sets everything in motion
    $("#add-button").on("click", function (event) {
        event.preventDefault();
        searchText = $("#searchText").val().trim(); // grabs text from input field
        $("#searchText").text("");
        topics.push(searchText); // pushes new search terms into the array used for creating buttons
        renderButtons();
        getGIFs();
        animateGIFs();
    })
});
function renderButtons() { // this function turns text from the input field into buttons that will be used for GIF searches
    $("#button-space").empty(); // empties out the div so buttons are not duplicated
    for (var i = 0; i < topics.length; i++) { // loops through the topics array to create buttons based on search terms; always rewrites all buttons
        var a = $("<button>");
        a.addClass("button-text btn-info");
        a.attr("data-name", topics[i]);
        a.text(topics[i]);
        $("#button-space").append(a);
    }
}
function getGIFs() { // get GIF data from the Giphy API; push selected items into dynamic divs then put into the DOM
    $(".button-text").on("click", function () { // listens for clicks on the search text buttons 
        gifSearch = $(this).attr("data-name"); // grabs text from the button
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=wxu2jPOXlj0bnJJQl4bDrvxy4Og5iADT&q=" + gifSearch + "&limit=10&offset=0&rating=G&lang=en";
        $.ajax({ // runs the AJAX get
            url: queryURL,
            method: "GET"
        })
            .then(function (response) { // this function pushes three distinct pieces of data from the API into the div before writing the new div to the DOM
                $("#gif-space").empty(); // clears any GIFs out of the gif space
                $("#gifs-title").text("These " + gifSearch + " GIFs are the next best thing to being there. Enjoy!");
                for (var j = 0; j < 10; j++) {
                    var gifsDiv = $("<div class='searchedGIF'>");
                    var image = $("<img>").attr({
                        "src": response.data[j].images.fixed_width_still.url,
                        "data-still": response.data[j].images.fixed_width_still.url,
                        "data-animate": response.data[j].images.fixed_width.url,
                        "data-state": "still",
                        "class": "gif"
                    });
                    var pZero = $("<div class='rating'>").html("Rating: " + response.data[j].rating.toUpperCase() + "<br>");
                    gifsDiv.append(image, pZero);
                    $("#gif-space").append(gifsDiv);
                };
                animateGIFs();
            });
    })
};
function animateGIFs() { // turns animation on and off 
    $(".gif").on("click", function () {
        var state = $(this).attr("data-state");
        if (state === "still") {
            $(this).attr("src", $(this).attr("data-animate"));
            $(this).attr("data-state", "animate");
        } else {
            $(this).attr("src", $(this).attr("data-still"));
            $(this).attr("data-state", "still");
        }
    })
}
