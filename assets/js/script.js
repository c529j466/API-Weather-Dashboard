var cityName = "";
var lat = "";
var lon = "";

  //function calling the weather API based on the users entered city
  function weatherInfo() {
   var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&lang=en&appid=7fbf7fa35159c759fb6f2423ce36d49c";

   $.ajax({
       url: queryURL,
       method: "GET"
   }).then(function (response) {
       // sets the lat and long variables to the cities latitude and longitude
       lat = response.coord.lat;
       lon = response.coord.lon;

       // Adds the users chosen city name to the html doc
       $("#city").text(response.name);
       // Adds the date 
       $("#date").text(moment.unix(response.dt).format("dddd, MM/DD/YYYY"));
                   
       // Uses local storage to save the users selected city name
       localStorage.setItem("cityname", response.name);
       
       // Using the latitude and longitude recieved from the response to use in the detailed OneCall API call
       detailedWeatherCall(lat,lon);

   })
}

 // Function using latitude and longitude to pulling weather details and then appending them to the html doc
 function detailedWeatherCall(la,lo) {
    var queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + la + "&lon=" + lo + "&exclude=minutely,hourly&appid=aec299195260a001b09706b5bfe740f7&units=imperial";

    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // Sets the icon of the current weather to the cards
        $(".card-deck").empty();
        var icon = response.current.weather[0].icon;
        var iconImg = $("<img>");
        iconImg.addClass("img-fluid");
        iconImg.attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png")
        $("#city").append(iconImg);

        // Sets color of UV Index based on how high or low it is
        var uvi = parseInt(response.current.uvi);
        if (uvi <= 2) {
            $(".color").css({ "background-color": "green", "color": "white" });
        } else if (uvi >= 3 && uvi <= 5) {
            $(".color").css({ "background-color": "yellow", "color": "black" });
        } else if (uvi >= 6 && uvi <= 7) {
            $(".color").css({ "background-color": "orange" });
        } else if (uvi >= 8 && uvi <= 10) {
            $(".color").css({ "background-color": "red", "color": "white" });
        } else if (uvi >= 11) {
            $(".color").css({ "background-color": "violet", "color": "white" });
        }

        // Sets weather data to html doc
        $("#temp").text("Temperature: " + response.current.temp + "° F");
        $("#humidity").text("Humidity: " + response.current.humidity + "%");
        $("#wind").text("Wind Speed: " + response.current.wind_speed + " MPH");
        $(".color").text(response.current.uvi);
        $("#current").css({"display":"block"});

        //Sets daily array from calls response to a variable
        var daily = response.daily;

        //loops through daily array, starting at 1 to exclude current day and taking off 6th and 7th day to give five day forecast
        for (i = 1; i < daily.length - 2; i++) {
            
            // Sets info to variables, creates html elements, and then appends them to the html doc 
            var Date = moment.unix(daily[i].dt).format("dddd MM/DD/YYYY");
            var Temp = daily[i].temp.day;
            var Hum = daily[i].humidity;
            var dailyIcon = daily[i].weather[0].icon;
            var weatherDiv = $("<div class='card text-white bg-primary p-2'>")
            var pTemp = $("<p>");
            var pHum = $("<p>");
            var imgIcon = $("<img>");
            var hDate = $("<h6>");
            hDate.text(Date);
            imgIcon.attr("src", "https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
            imgIcon.addClass("img-fluid");
            imgIcon.css({"width": "100%"});
            pTemp.text("Temp: " + Temp + "° F");
            pHum.text("Humidity: " + Hum + "%");
            weatherDiv.append(hDate);
            weatherDiv.append(imgIcon);
            weatherDiv.append(pTemp);
            weatherDiv.append(pHum);
            $(".card-deck").append(weatherDiv);
            $("#five-day").css({"display":"block"});
        }

    })
}

  //Pulls in the last searched city from local storage to the page
  function lastSearched(){
    cityName = localStorage.getItem("cityname");
    if (cityName !== null) {

        var cityList = $("<button>");
        cityList.addClass("list-group-item list-group-item-action");
        cityList.text(cityName);
        $("ul").prepend(cityList);
        weatherInfo()
    }
}

    // Creates buttons once a user searchs a city to pull up the information of that city 
    function cityButtons() {
        cityName = $("input").val().trim();
        var cityList = $("<button>");
        cityList.addClass("list-group-item list-group-item-action");
        cityList.text(cityName);
        $("ul").prepend(cityList);
        $("input").val("");

        // Calls previous function to pull in weather info once city buttons are clicked
        weatherInfo();
    }
    // Calls functions to load the info for the last searched city to the page
    lastSearched();




    // Event Listener for form submit
    $("#city-form").submit(function (event) {
        event.preventDefault();
        cityButtons();
    })

    // Event listener for search button click
    $("#form-submit").click(function (event) {
        event.preventDefault();
        cityButtons();
    })

    // Event listener for city buttons
    $("ul").on("click", "button", function () {
        cityName = $(this).text();
        console.log(cityName);

        weatherInfo();
    })

