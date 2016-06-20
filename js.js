/*global $, console */

$(document).ready(function () {
  "use strict";

  function getWeather(lat, lon) {
    var openWeatherAPI = "http://api.openweathermap.org/data/2.5/weather?",
      latitude,
      longitude,
      weatherData;
    weatherData = $.getJSON(openWeatherAPI, {lat: lat,
                                             lon: lon,
                                             appid: "2102d3e0ed083053990492f54bbf38e2"})
      .done(function (data) {
        $("#data").text("openWeather Data: " + data.name);
        console.log(data);
      })
      .fail(function (jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        $("#data").text("Request Failed: " + err);
      });
  }

  function getLocation() {
    var geo = [];
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        getWeather(position.coords.latitude, position.coords.longitude);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  getLocation();
});


