var APIKey = "0544d7752b7cf21b57b19a2cc047173f"

var citySearchEl = $("#city-search");
var popularCityEl = $("#popular-city")

//When the search button is clicked, intake typed value
function handleSearchData(event) {
    event.preventDefault();
    var btnClicked = $(event.target);
    var currentInput = btnClicked.parent().children()[0].value;
    
    console.log(currentInput);
    getCurrentConditions();
}

function handlePopularCityClick(event) {
    event.preventDefault();

    var btnClicked = event.target.getAttribute('data-language');

    console.log(btnClicked);
    getCurrentConditions();
}


function getCurrentConditions(event) {
    var city = $('#search-city').val();
    
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial' + '&appid=' + APIKey;
    fetch(requestURL)
        .then(function(response) {
            return response.json();
        })
        .then (function(data) {
            console.log(data);

            var iconCode = data.weather[0].icon;
            var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

            var currentCity = $(`
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h2 class="subtitle" id="cityWeatherToday">
                            ${data.name} <img src='${iconURL}' alt='${data.weather[0].description}'>
                         </h2>
                        <p>Temperature: ${data.main.temp} Degrees F</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                        <p>Wind Speed: ${data.wind.speed} MPH</p>
                    </div>
                </div>
            `);

             $("#currentCity").append(currentCity);
        })
}


//Event listener for city search input
citySearchEl.on('click', '.btn', handleSearchData)

//Event listener for popular city buttons
popularCityEl.on('click', '.btn', handlePopularCityClick)

//ESSENTIAL TO DOS
//TODO: Create local storage data for recent searches
//TODO: Create append function for recent searches to the sidebar
//TODO: Successfully pull API data from Open Weather Map for current day
//TODO: Create loop for 5 day forecast, rendering to the cards
//Readme updated

//STYLE BONUS
//Improve UI with more custom look/feel
//Figure out FontAwesome