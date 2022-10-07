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

