/*global $, console */

$(document).ready(function () {
  "use strict";

  var temp_in_F = true,
    temp = 0;

  var dataArray = [];

  function setScene() {

    $("#location").text(dataArray.city + ", " + dataArray.country);

    //check if day or night
    if (dataArray.dataTime > dataArray.sunRise && dataArray.dataTime < dataArray.sunSet) {
      $('#background').css("background-image", "url(http://res.cloudinary.com/jgoebel/image/upload/v1466975924/bg_day_nn4fmc.svg)");
      $('#orbit').addClass('sun');
    } else {
      $('#background').css("background-image", "url(http://res.cloudinary.com/jgoebel/image/upload/v1466996108/bg_night_ipaoin.svg)");
      $('#background').append('<div class="stars"></div>');
      $('#orbit').addClass('moon');
    }

    //place clouds depending on % of cloud cover... randomly
    if (dataArray.cloudPercentage >= 10) {
      for (var i = 0; i < (dataArray.cloudPercentage / 10) * 2; i++) {
        //create the clouds
        $('#clouds').append('<div class="cloud"></div>');
        //Randomize position of clouds
        var x = Math.floor(Math.random() * (80 - 0) + 0);
        var y = Math.floor(Math.random() * (50 - 0) + 0);

        $("#clouds .cloud:nth-child(" + (i+1)  + ")").css ({
          "top": "" + y + "%",
          "left": "" + x - 10 + "%"
        });
      }
    }

    //Display weather icons
    var iconURL = '';
    switch (Math.floor(dataArray.weatherID / 100)) {
      case 2: // Thunderstorm
        iconURL = "url(http://res.cloudinary.com/jgoebel/image/upload/v1467090301/Thunderstorm_ftyvvm.svg)";
        break;
      case 3: // Drizzle
        iconURL = "url(http://res.cloudinary.com/jgoebel/image/upload/v1467090301/drizzle_lkueia.svg)";
        break;
      case 5: // Rain
        iconURL = "url(http://res.cloudinary.com/jgoebel/image/upload/v1467090301/rain_n5umxy.svg)";
        break;
      case 6: // Snow
        iconURL = "url(http://res.cloudinary.com/jgoebel/image/upload/v1467090301/snow_dek4bo.svg)";
        break;
      case 7: // Atmosphere
        break;
      case 8:
        if (dataArray.weatherID == 800) {
         if (dataArray.dataTime > dataArray.sunRise && dataArray.dataTime < dataArray.sunSet) {
          iconURL = "url(http://res.cloudinary.com/jgoebel/image/upload/v1467090301/clearSkyDay_cwblio.svg)";
         } else {
          iconURL = "url(http://res.cloudinary.com/jgoebel/image/upload/v1467087257/clearSkyNight_1_zh3x2t.svg)";
         }
        } else {
          iconURL = "url(http://res.cloudinary.com/jgoebel/image/upload/v1467090301/Cloudy_lutcm8.svg)";
        }
        break; //  clear < 800 > cloudy
      default: // icons not set
    }
    $('#weather_icon').css("background-image", iconURL);

    //Display Weather Digits
    temp = dataArray.temperature;
    displayTemp();

    //Display Weather Discription.
    $("#weather_discription").text(dataArray.description);

    //Write out weather message.
    weatherMessage();
  }

  function weatherMessage() {
    var buildString = '';
    buildString += "It is currently " + "<span>" + $("#weather_digits").text() + "</span> in ";
    buildString += "<span>" + dataArray.city + "</span>. We are experiencing <span>" + dataArray.description + "</span>. ";
    buildString += "A <span>" + displayWindSpeed() + "</span> wind is blowing in from the <span>" + getDirection() + "</span> ";
    buildString += "and the humidity level is at <span>" + dataArray.humidity + "%</span>. ";
    $("#discription").html(buildString);
  }

  function getWeather(city,countryCode) {
    var openWeatherAPI = "http://api.openweathermap.org/data/2.5/weather?";
    var weatherData = $.getJSON(openWeatherAPI, {q: city + "," + countryCode, appid:"2102d3e0ed083053990492f54bbf38e2"})
      .done(function (data) {
        dataArray = {
          "city": data.name,
          "sceneType": data.weather[0].main,
          "weatherID": data.weather[0].id,
          "description": data.weather[0].description,
          "temperature": data.main.temp,
          "dataTime": data.dt,
          "sunRise": data.sys.sunrise,
          "sunSet": data.sys.sunset,
          "country": data.sys.country,
          "cloudPercentage": data.clouds.all,
          "windSpeed": data.wind.speed,
          "windDirection": data.wind.deg,
          "humidity": data.main.humidity
        };
        setScene();
      })
      .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        $("#data").text("Request Failed: " + err);
      });
  }

  function displayTemp () {
    if (temp_in_F === true) {
      $("#weather_digits").html("" + Math.floor(temp * (9/5) - 459.67) + "&deg;f");
      weatherMessage();
    } else {
      $("#weather_digits").html("" + Math.floor(temp - 273.15) + "&deg;c");
      weatherMessage();
    }
  }

  function displayWindSpeed () {
    if (temp_in_F === true) {
      return Number(dataArray.windSpeed * 2.23694).toFixed(1) + " mph";
    } else {
      return (dataArray.windSpeed) + " m/s";
    }
  }

  function getDirection () {
    if (dataArray.windDirection >= 340){
      return "north";
    } else if (dataArray.windDirection >= 295) {
      return "north-west";
    } else if (dataArray.windDirection >= 250) {
      return "west";
    } else if (dataArray.windDirection >= 205) {
      return "south-west";
    } else if (dataArray.windDirection >= 160) {
      return "south";
    } else if (dataArray.windDirection >= 115) {
      return "south-east";
    } else if (dataArray.windDirection >= 70) {
      return "east";
    } else if (dataArray.windDirection >= 25) {
      return "north-east";
    } else {
      return "north";
    }
  }

  $("#weather_digits").click(function(){
    if (temp_in_F === true){
      temp_in_F = false;
      displayTemp();
    } else {
      temp_in_F = true;
      displayTemp();
    }
  });

  $.getJSON('http://ip-api.com/json', function(ipAPI) {
    getWeather(ipAPI.city, ipAPI.countryCode);
  })
});


