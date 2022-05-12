var APIKey = "0544d7752b7cf21b57b19a2cc047173f"
var city;
var state;
var country;

var citySearchEl = $("#city-search");
var popularCityEl = $("#popular-city")

//When the search button is clicked, intake typed value
function handleSearchData(event) {
    event.preventDefault();
    var btnClicked = $(event.target);
    var currentInput = btnClicked.parent().children()[0].value;
    
    console.log(currentInput);
}

function handlePopularCityClick(event) {
    event.preventDefault();

    var btnClicked = event.target.getAttribute('data-language');

    console.log(btnClicked);
}

//Event listener for city search input
citySearchEl.on('click', '.btn', handleSearchData)

//Event listener for popular city buttons
popularCityEl.on('click', '.btn', handlePopularCityClick)




// var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

// fetch(queryURL);



