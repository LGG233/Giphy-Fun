var searchText = ""; // text from input box that will eventually become search term on Giphy
var topics = ["Paris", "London", "Rome", "New York", "Hong Kong", "Tokyo"];
var gifArray = []; // will hold all the JSON data returned from the AJAX get
var gifSearch = ""; // name of searchText used in query URL and to push to DOM

renderButtons();
getGIFs();

$(document).ready(function () { // sets everything in motion
    $("#add-user").on("click", function (event) {
        event.preventDefault();
        searchText = $("#searchText").val().trim(); // grabs text from input field
        topics.push(searchText); // pushes new search terms into the array used for creating buttons
        renderButtons();
        getGIFs();
    })
});
function renderButtons() { // this function turns text from the input field into buttons that will be used for GIF searches
    $("#button-space").empty(); // empties out the div so buttons are not duplicated
    for (var i = 0; i < topics.length; i++) { // loops through the topics array to create buttons based on search terms; always rewrites all buttons
        var a = $("<button>");
        a.addClass("button-text");
        a.addClass("btn-primary");
        a.attr("data-name", topics[i]);
        a.text(topics[i]);
        $("#button-space").append(a);
    }
}
function getGIFs() { // get GIF data from the Giphy API; push selected items into new array that will be used to dynamically create GIFs on DOM
    $(".button-text").on("click", function () { // listens for clicks on the search text buttons 
        $("#gif-space").empty(); // clears any GIFs out of the gif space
        gifSearch = $(this).attr("data-name"); // grabs the text from the button
        var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=wxu2jPOXlj0bnJJQl4bDrvxy4Og5iADT&q=" + gifSearch + "&limit=10&offset=0&rating=G&lang=en";
        $.ajax({ // runs the AJAX get
            url: queryURL,
            method: "GET"
        })
            .then(function (response) { // this function pushes three distinct pieces of data from the API into the array from which the GIFs will be constructed
                for (var j = 0; j < 10; j++) {
                    var fixedURL = response.data[j].images.fixed_width_still.url; // the still image
                    var movingURL = response.data[j].images.fixed_width.url // the animated image
                    var gifRating = response.data[j].rating // the rating of the GIF
                    gifArray.push({ // pushes data from response into the array; sets them up as objects so each individual data item can be pushed into the div for each GIF
                        fixed_url: fixedURL,
                        gif_url: movingURL,
                        rating: gifRating
                    });
                }
                gifsDOM();
            })
    })
}
function gifsDOM() { // pushes the GIFs to the DOM. Assigns numerous attributes to the image tag so that animation can be turned on and off. Creates each individual div virtually then posts entire div to DOM
    $("#gifs-title").text("These " + gifSearch + " GIFs are the next best thing to being there. Enjoy!");
    for (var x = 0; x < gifArray.length; x++) {
        var gifsDiv = $("<span class='buttonGIF'>");
        var image = $("<img>").attr({
            "src": gifArray[x].fixed_url,
            "data-still": gifArray[x].fixed_url,
            "data-animate": gifArray[x].gif_url,
            "data-state": "still",
            "class": "gif"
        })
            gifsDiv.append(image);
            var pZero = $("<span>").text("Rating: " + gifArray[x].rating);
            gifsDiv.append(pZero);
            $("#gif-space").prepend(gifsDiv);
    }
    animateGIFs();
}
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
