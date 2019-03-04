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

//     makeButton();
// });

// $("#target").submit(function (event) {
//     alert("Handler for .submit() called.");
//     event.preventDefault();
// });

var searchText = "";
var topics = ["Bee", "Hornet", "Wasp", "Praying Mantis", "Cricket"];
var gifArray = [];
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
                    fixedURL = response.data[j].images.fixed_width_still.url;
                    movingURL = response.data[j].images.fixed_width.url
                    gifRating = response.data[j].rating
                    gifArray.push({
                        fixed_url: fixedURL,
                        gif_url: movingURL,
                        rating: gifRating
                    });
                }
                console.log(gifArray);
                console.log("array length = " + gifArray.length);
                gifsDOM();
            })
    })
    console.log("this is the gifArray")
}
function gifsDOM() {
    for (var x = 0; x < gifArray.length; x++) {
        var gifsDiv = $("<div class='buttonGIF'>");
        var image = $("<img>").attr("src", gifArray[x].fixed_url);
        gifsDiv.append(image);
        var pZero = $("<p>").text("Rating: " + gifArray[x].rating);
        gifsDiv.append(pZero);
        $("#gif-space").prepend(gifsDiv);
    }
}

