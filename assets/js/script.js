var APIKey = "0544d7752b7cf21b57b19a2cc047173f"

var citySearchEl = $("#city-search");

var today = moment().format("L");
var searchHistory = [];
var city = $('#search-city');

//When the search button is clicked, intake typed value
function handleSearchData(event) {
    event.preventDefault();
    var btnClicked = $(event.target);
    var currentInput = btnClicked.parent().children()[0].value.trim().toUpperCase();
    // currentInput = currentInput.trim()
    getCurrentConditions(city.val());

    searchHistory.push(currentInput);
    //Render search history buttons to page
    showButtons(currentInput);

    for (var i = 0; i < searchHistory.length; i++) {
        localStorage.setItem(i, searchHistory[i]);
    }
}

//Search history button render
function showButtons(city) {
        var searchButton = document.createElement("button");
        searchButton.classList.add("btn");
        searchButton.textContent = city;
        var searchHistoryDiv = $('#search-history');
        searchHistoryDiv.append(searchButton);
        searchButton.addEventListener("click", function(event) {
            event.preventDefault();
            getCurrentConditions(searchButton.textContent)
        })
}

//Gets saved city data from local storage
function getCities () {
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var value = localStorage.getItem(key);
        searchHistory.push(value);
        console.log(searchHistory);
    }
    for (var i = 0; i < localStorage.length; i++) {
        showButtons(localStorage.getItem(i))
        
    }
}
getCities();


function getCurrentConditions(city) {
    
    //Assigns query for the open weather map api to the current value in the search button
    var requestURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial' + '&appid=' + APIKey;
    fetch(requestURL)
        .then(function(response) {
            return response.json();
        })
        .then (function(data) {
            //Feches icon data and creates img url
            $("#currentCity").empty();
            var iconCode = data.weather[0].icon;
            var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;

            //Creates new div with API data for current temp
            var currentCity = $(`
                <div class="card">
                    <div class="card-body" id="cityWeatherToday">
                        <h2 class="subtitle">
                            ${data.name} ${today} <img src='${iconURL}' alt='${data.weather[0].description}'>
                         </h2>
                        <p>Temperature: ${data.main.temp} °F</p>
                        <p>Humidity: ${data.main.humidity}%</p>
                        <p>Wind Speed: ${data.wind.speed} MPH</p>
                    </div>
                </div>
            `);

            //Appends the new div to the DOM
             $("#currentCity").append(currentCity);

             //UV Index
             var lat = data.coord.lat;
             var lon = data.coord.lon;
             var uvURL = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${APIKey}`;

             fetch(uvURL)
                .then(function(response){
                    return response.json();
                })
                .then(function(data){
                    console.log(data);

                    var uvIndexValue = data.value;
                    console.log(uvIndexValue);
                    var uvIndex = $(`
                        <p>UVI Index: 
                            <span id="uvIndexColor" class="badge">${uvIndexValue}</span>
                        </p>
                    `)

                    //Add UV Index data to the page
                    $('#cityWeatherToday').append(uvIndex);

                    //Apply color background to UV Index depending on value
                    if (uvIndexValue >= 0 && uvIndexValue <= 2) {
                        $("#uvIndexColor").css("background-color", "green").css("color", "white");
                    } else if (uvIndexValue >= 3 && uvIndexValue <=5) {
                        $("#uvIndexColor").css("background-color", "yellow").css("color", "black");
                    } else if (uvIndexValue >= 6 && uvIndexValue <=7) {
                        $("#uvIndexColor").css("background-color", "orange").css("color", "white");
                    } else if (uvIndexValue >= 8 && uvIndexValue <=10) {
                        $("#uvIndexColor").css("background-color", "red").css("color", "white");
                    } else {
                        $("#uvIndexColor").css("background-color", "purple").css("color", "white");
                    }
                })
            
            getFutureConditions(lat, lon);
        })
}

//Render future conditions to the page
function getFutureConditions(lat, lon){
    var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alerts&appid=${APIKey}`;

    fetch(futureURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log(data);
            $("#futureForecast").empty();

            //After the first value (today), render the next 5 day forecast
            for (var i = 1; i < 6; i++) {
                var futureInfo = {
                    date: data.daily[i].dt,
                    icon: data.daily[i].weather[0].icon,
                    temp: data.daily[i].temp.day,
                    wind: data.daily[i].wind_speed,
                    humidity: data.daily[i].humidity
                };

                var futureDate = moment.unix(futureInfo.date).format("MM/DD/YYYY");
                var futureIcon = `<img src="https://openweathermap.org/img/w/${futureInfo.icon}.png" alt="${data.daily[i].weather[0].main}" />`;

                var futureCard = $(`

                        <div class="card col-sm m-3 p-3">
                            <h5 class="card-title">${futureDate}</h5>
                            <p>${futureIcon}</p>
                            <p class="card-text">Temp: ${futureInfo.temp} °F</p>
                            <p class="card-text">Wind: ${futureInfo.wind} MPH</p>
                            <p class="card-text">Humidity: ${futureInfo.humidity}%</p>
                        </div>
                `)

                $('#futureForecast').append(futureCard);                
            }
        })

}

//Event listener for city search input
citySearchEl.on('click', '.btn', handleSearchData)