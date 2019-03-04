// Pseudocode
// 0. Set up page -- don't use Jumbotron
// 0.1 elements required for page:
// - input box
// - "create button" button
// NB: buttons created need to serve as triggers for GIPHY API search using name of button as search term
// NB: must have event.preventDefault(); to keep buttons from refreshing page when submitting request

// 1. Turn search term into button
// 1.1 Capture text input into textbox
// 1.2 create new button using input from textbox as name
// 1.3 display buttons across top of page
// NB: no need to 

// 2. AJAX request with Giphy API
// 2.1 build URL for AJAX request dynamically to pull text from button name on click then create the URL

var searchText = ""; // text from input box that will eventually become search term on Giphy
var topics = ["Paris", "London", "Rome", "New York", "Hong Kong", "Tokyo"];
var gifArray = []; // will hold all the JSON data returned from the AJAX get
var gifSearch = ""; // name of searchText used in query URL and to push to DOM
var url = ""; 
var rating = "";

renderButtons();
getGIFs();

$(document).ready(function () {
    $("#add-user").on("click", function (event) {
        event.preventDefault();
        searchText = $("#searchText").val().trim();
        topics.push(searchText);
        renderButtons();
        getGIFs();
    })
});
function renderButtons() {
    $("#button-space").empty();
    for (var i = 0; i < topics.length; i++) {
        var a = $("<button>");
        a.addClass("button-text");
        a.addClass("btn-primary");
        a.attr("data-name", topics[i]);
        a.text(topics[i]);
        $("#button-space").append(a);
    }
}
function getGIFs() {
    $(".button-text").on("click", function () {
        $("#gif-space").empty();
        gifArray = [];
        var gifSearch = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=wxu2jPOXlj0bnJJQl4bDrvxy4Og5iADT&q=" + gifSearch + "&limit=10&offset=0&rating=G&lang=en";
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                for (var j = 0; j < 10; j++) {
                    var fixedURL = response.data[j].images.fixed_width_still.url;
                    var movingURL = response.data[j].images.fixed_width.url
                    var gifRating = response.data[j].rating
                    gifArray.push({
                        fixed_url: fixedURL,
                        gif_url: movingURL,
                        rating: gifRating
                    });
                }
                gifsDOM();
            })
    })
}
function gifsDOM() {
    $("#gifs-title").text("Here are your GIFs. Enjoy!");
    for (var x = 0; x < gifArray.length; x++) {
        var gifsDiv = $("<div class='buttonGIF'>");
        var image = $("<img>").attr({
            "src": gifArray[x].fixed_url,
            "data-still": gifArray[x].fixed_url,
            "data-animate": gifArray[x].gif_url,
            "data-state": "still",
            "class": "gif"
        })
        gifsDiv.append(image);
        var pZero = $("<p>").text("Rating: " + gifArray[x].rating);
        gifsDiv.append(pZero);
        $("#gif-space").prepend(gifsDiv);
    }
    animateGIFs();
}
function animateGIFs() {
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
